import { z } from "zod";

import {
  argon2idHashSchema,
  httpsUrlSchema,
  postgresUrlSchema,
  positiveIntSchema,
  secretSchema,
  toSafeIssues,
  type SafeIssue,
} from "./validation";

/*
 * SYCONIA fail-closed environment validator — M1-T007, ARCHITECTURE §12
 * ("All configuration via environment variables validated at boot by
 * /lib/env.ts (Zod; process exits on invalid — fail-closed)"), SECURITY §11
 * ("secrets … never in logs"), .env.example.
 *
 * Usage:
 * - `bootValidateEnv()` — called once at server boot (instrumentation.ts):
 *   on invalid environment it logs the SAFE issue list (names + reasons,
 *   never values) and exits with code 1.
 * - `getEnv()` — cached typed accessor for server code (middleware, API
 *   routes, services). Throws EnvValidationError on first call if the
 *   process environment is invalid — callers surface HTTP 500, not values.
 * - `parseEnv(source)` — pure validation function (unit-testable with
 *   fixtures; tests never touch process.env).
 *
 * Unknown environment variables pass through untouched (an OS process
 * environment carries PATH/NODE_ENV/etc.); only §12 variables and the
 * RATE_LIMIT_* / SOURCE_<SLUG>_KEY families are validated.
 */

const envSchema = z
  .object({
    /** Postgres (direct). */
    DATABASE_URL: postgresUrlSchema,
    /** Postgres (pooled). */
    DATABASE_POOL_URL: postgresUrlSchema,
    /** Age-cookie HMAC signing key. */
    AGE_SECRET: secretSchema,
    /** Cursor HMAC signing key. */
    CURSOR_SECRET: secretSchema,
    /** Admin-session HMAC signing key. */
    SESSION_SECRET: secretSchema,
    /** Cron job-endpoint auth secret. */
    CRON_SECRET: secretSchema,
    /** Admin bootstrap username. */
    ADMIN_USERNAME: z.string().min(1, { message: "must not be empty" }),
    /** Admin bootstrap password hash (argon2id, SECURITY §11 minimums). */
    ADMIN_PASSWORD_HASH: argon2idHashSchema,
    /** Canonical site URL (SEO, absolute links). */
    SITE_URL: httpsUrlSchema,
    /** Site display name (§12 fixes SYCONIA; overridable, same default). */
    SITE_NAME: z.string().min(1).default("SYCONIA"),
    /** Log verbosity. */
    LOG_LEVEL: z
      .enum(["debug", "info", "warn", "error"])
      .default("info"),
    /**
     * Neutral leave-site target for the age gate (SCREENS S-01) — must be
     * https and non-adult/neutral; the URL is operator-chosen, only the
     * scheme is machine-checkable.
     */
    AGE_LEAVE_URL: httpsUrlSchema,
  })
  .passthrough()
  .superRefine((env, ctx) => {
    // RATE_LIMIT_* (ops tuning): every present member must be a positive int.
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) continue;
      if (/^RATE_LIMIT_[A-Z0-9_]+$/.test(key)) {
        const result = positiveIntSchema.safeParse(value);
        if (!result.success) {
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: result.error.issues[0]?.message ?? "must be a positive integer",
          });
        }
      }
    }
    // SOURCE_<SLUG>_KEY (per-source API keys): secrets ≥ 32 chars.
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) continue;
      if (/^SOURCE_[A-Z0-9]+(_[A-Z0-9]+)*_KEY$/.test(key)) {
        const result = secretSchema.safeParse(value);
        if (!result.success) {
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "per-source API key must be at least 32 characters",
          });
        }
      }
    }
  });

/** Typed environment (known §12 vars + passthrough unknowns). */
export type Env = z.infer<typeof envSchema>;

/** Anything shaped like process.env. */
export type EnvSource = Record<string, string | undefined>;

/** Validation failure carrying SAFE issues (names + reasons, never values). */
export class EnvValidationError extends Error {
  readonly safeIssues: SafeIssue[];

  constructor(safeIssues: SafeIssue[]) {
    super(
      `invalid environment (${safeIssues.length}):\n` +
        safeIssues.map((issue) => `  - ${issue.varName}: ${issue.reason}`).join("\n"),
    );
    this.name = "EnvValidationError";
    this.safeIssues = safeIssues;
  }
}

/**
 * Validate an environment source. Throws {@link EnvValidationError} whose
 * message lists variable names and reasons only — never values, so the
 * error is safe to log (SECURITY §11).
 */
export function parseEnv(source: EnvSource): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new EnvValidationError(toSafeIssues(result.error));
  }
  return result.data;
}

let cachedEnv: Env | undefined;

/**
 * Cached typed accessor for server code. First call parses process.env and
 * throws EnvValidationError if invalid — no second validation pass.
 */
export function getEnv(): Env {
  cachedEnv ??= parseEnv(process.env);
  return cachedEnv;
}

/**
 * Boot-time fail-closed gate (ARCHITECTURE §12): validates the environment
 * and, when invalid, logs the SAFE issue list and exits with code 1.
 * `exit`/`log` are injectable for tests; production callers take the
 * defaults (process.exit / console.error).
 */
export function bootValidateEnv(options: {
  source?: EnvSource;
  exit?: (code: number) => void;
  log?: (message: string) => void;
} = {}): Env {
  const { source = process.env, exit = process.exit, log = console.error } =
    options;
  try {
    const env = parseEnv(source);
    if (source === process.env) {
      cachedEnv = env;
    }
    return env;
  } catch (error) {
    if (error instanceof EnvValidationError) {
      log(
        `SYCONIA boot aborted — refusing to start with an invalid environment.\n${error.message}`,
      );
      exit(1);
    }
    throw error;
  }
}
