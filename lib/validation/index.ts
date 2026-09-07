import { z } from "zod";

/*
 * SYCONIA shared Zod schema home — M1-T007, SOP §3 ("Zod at every
 * boundary"), SECURITY §11, ARCHITECTURE §12.
 *
 * This module is the single source of reusable validation primitives.
 * Feature-specific schemas (adapter payloads, API request bodies, admin
 * forms) are defined next to their owning boundaries in later tasks and
 * compose these primitives — they never re-declare them.
 *
 * Safety contract: validation failures are reported as SAFE issues
 * (variable/field NAME + reason) — never the offending value, so no secret
 * can leak into logs through an error path (SECURITY §11 "never in logs").
 */

/** HMAC-style secret: ≥ 32 random chars (.env.example header rule). */
export const secretSchema = z
  .string()
  .min(32, { message: "must be at least 32 characters" });

/** Public or redirect URL: https only (SECURITY — no plaintext targets). */
export const httpsUrlSchema = z.url({
  protocol: /^https$/,
  error: "must be an https:// URL",
});

/** Postgres connection URL (direct or pooled). */
export const postgresUrlSchema = z.url({
  protocol: /^(postgres|postgresql)$/,
  error: "must be a postgres:// or postgresql:// URL",
});

/**
 * Argon2id encoded hash, parameter-checked against SECURITY §11
 * ("argon2id, 19MiB/t=2/p=1 minimum"): m ≥ 19456 KiB, t ≥ 2, p ≥ 1.
 */
const ARGON2ID_ENCODED =
  /^\$argon2id\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+)\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/;

export const ARGON2ID_MIN_MEMORY_KIB = 19456;
export const ARGON2ID_MIN_TIME_COST = 2;
export const ARGON2ID_MIN_PARALLELISM = 1;

export const argon2idHashSchema = z
  .string()
  .regex(ARGON2ID_ENCODED, { message: "must be an argon2id encoded hash" })
  .superRefine((value, ctx) => {
    const match = value.match(ARGON2ID_ENCODED);
    if (!match) return;
    const memory = Number(match[2]);
    const time = Number(match[3]);
    const parallelism = Number(match[4]);
    if (memory < ARGON2ID_MIN_MEMORY_KIB) {
      ctx.addIssue({
        code: "custom",
        message: `argon2 memory cost m=${memory} is below the SECURITY §11 minimum of ${ARGON2ID_MIN_MEMORY_KIB} (19 MiB)`,
      });
    }
    if (time < ARGON2ID_MIN_TIME_COST) {
      ctx.addIssue({
        code: "custom",
        message: `argon2 time cost t=${time} is below the SECURITY §11 minimum of ${ARGON2ID_MIN_TIME_COST}`,
      });
    }
    if (parallelism < ARGON2ID_MIN_PARALLELISM) {
      ctx.addIssue({
        code: "custom",
        message: `argon2 parallelism p=${parallelism} is below the SECURITY §11 minimum of ${ARGON2ID_MIN_PARALLELISM}`,
      });
    }
  });

/** Ops tuning knob: positive integer (RATE_LIMIT_* family). */
export const positiveIntSchema = z
  .string()
  .regex(/^\d+$/, { message: "must be a positive integer" })
  .refine((value) => Number(value) >= 1, {
    message: "must be a positive integer (≥ 1)",
  });

/**
 * A safe validation issue: the failing field's NAME and a human-readable
 * reason. Never includes the value.
 */
export type SafeIssue = { varName: string; reason: string };

/** Convert a Zod error into safe issues (names + reasons only). */
export function toSafeIssues(error: z.ZodError): SafeIssue[] {
  return error.issues.map((issue) => ({
    varName: issue.path.length > 0 ? issue.path.join(".") : "(root)",
    reason: issue.message,
  }));
}
