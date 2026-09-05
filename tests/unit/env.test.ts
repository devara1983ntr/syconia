import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  bootValidateEnv,
  EnvValidationError,
  getEnv,
  parseEnv,
  type EnvSource,
} from "@/lib/env";

/**
 * M1-T007 fail-closed environment validator tests (ARCHITECTURE §12,
 * SECURITY §11): every §12 variable is validated, boot fails closed on
 * missing/weak values, and no secret value ever reaches a log line.
 * All cases run against fixture sources — process.env is untouched except
 * the single getEnv-caching test, which stubs it explicitly.
 */

const ARGON2ID_MIN =
  "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$ZGFoZGFoZGFoZGFoZGFoZGFoZGFoZA";

const WEAK_SECRET = "012345678901234567890123456789"; // 30 chars — deliberately weak

function validEnv(overrides: Record<string, string | undefined> = {}): EnvSource {
  return {
    DATABASE_URL: "postgresql://user:pass@host:5432/syconia",
    DATABASE_POOL_URL: "postgresql://user:pass@pool-host:6543/syconia",
    AGE_SECRET: "a".repeat(40),
    CURSOR_SECRET: "b".repeat(40),
    SESSION_SECRET: "c".repeat(40),
    CRON_SECRET: "d".repeat(40),
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD_HASH: ARGON2ID_MIN,
    SITE_URL: "https://example.com",
    AGE_LEAVE_URL: "https://www.wikipedia.org",
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("parseEnv — valid environment", () => {
  it("returns a typed environment with the §12 defaults", () => {
    const env = parseEnv(validEnv());
    expect(env.DATABASE_URL).toBe("postgresql://user:pass@host:5432/syconia");
    expect(env.SITE_NAME).toBe("SYCONIA");
    expect(env.LOG_LEVEL).toBe("info");
  });

  it("honors explicit SITE_NAME and LOG_LEVEL", () => {
    const env = parseEnv(validEnv({ SITE_NAME: "SYCONIA", LOG_LEVEL: "warn" }));
    expect(env.SITE_NAME).toBe("SYCONIA");
    expect(env.LOG_LEVEL).toBe("warn");
  });

  it("passes unknown variables through untouched", () => {
    const env = parseEnv(validEnv({ PATH: "/usr/bin", NODE_ENV: "production" }));
    expect(env.PATH).toBe("/usr/bin");
    expect(env.NODE_ENV).toBe("production");
  });
});

describe("parseEnv — every §12 variable is required", () => {
  const requiredVars = [
    "DATABASE_URL",
    "DATABASE_POOL_URL",
    "AGE_SECRET",
    "CURSOR_SECRET",
    "SESSION_SECRET",
    "CRON_SECRET",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD_HASH",
    "SITE_URL",
    "AGE_LEAVE_URL",
  ];

  it.each(requiredVars)("fails closed when %s is missing", (name) => {
    const source = validEnv();
    delete source[name];
    expect(() => parseEnv(source)).toThrow(EnvValidationError);
    try {
      parseEnv(source);
    } catch (error) {
      expect((error as EnvValidationError).message).toContain(name);
    }
  });
});

describe("parseEnv — weak values fail closed", () => {
  it("rejects secrets shorter than 32 chars without leaking them", () => {
    expect(() => parseEnv(validEnv({ AGE_SECRET: WEAK_SECRET }))).toThrow(
      EnvValidationError,
    );
    try {
      parseEnv(validEnv({ AGE_SECRET: WEAK_SECRET }));
    } catch (error) {
      const message = (error as EnvValidationError).message;
      expect(message).toContain("AGE_SECRET");
      expect(message).not.toContain(WEAK_SECRET);
    }
  });

  it("rejects non-https SITE_URL and AGE_LEAVE_URL", () => {
    expect(() => parseEnv(validEnv({ SITE_URL: "http://example.com" }))).toThrow(
      /SITE_URL/,
    );
    expect(() =>
      parseEnv(validEnv({ AGE_LEAVE_URL: "http://www.wikipedia.org" })),
    ).toThrow(/AGE_LEAVE_URL/);
  });

  it("rejects non-postgres database URLs", () => {
    expect(() => parseEnv(validEnv({ DATABASE_URL: "mysql://host/db" }))).toThrow(
      /DATABASE_URL/,
    );
  });

  it("rejects an unknown LOG_LEVEL", () => {
    expect(() => parseEnv(validEnv({ LOG_LEVEL: "loud" }))).toThrow(/LOG_LEVEL/);
  });

  it("rejects weak argon2id parameters", () => {
    expect(() =>
      parseEnv(validEnv({ ADMIN_PASSWORD_HASH: ARGON2ID_MIN.replace("m=19456", "m=1024") })),
    ).toThrow(/ADMIN_PASSWORD_HASH/);
    expect(() =>
      parseEnv(validEnv({ ADMIN_PASSWORD_HASH: ARGON2ID_MIN.replace("t=2", "t=1") })),
    ).toThrow(/ADMIN_PASSWORD_HASH/);
  });

  it("rejects non-integer RATE_LIMIT_* values", () => {
    expect(() =>
      parseEnv(validEnv({ RATE_LIMIT_READS_PER_MIN: "abc" })),
    ).toThrow(/RATE_LIMIT_READS_PER_MIN/);
    expect(() =>
      parseEnv(validEnv({ RATE_LIMIT_READS_PER_MIN: "0" })),
    ).toThrow(/RATE_LIMIT_READS_PER_MIN/);
  });

  it("accepts valid RATE_LIMIT_* values", () => {
    const env = parseEnv(validEnv({ RATE_LIMIT_READS_PER_MIN: "120" }));
    expect(env.RATE_LIMIT_READS_PER_MIN).toBe("120");
  });

  it("rejects short SOURCE_<SLUG>_KEY values", () => {
    expect(() =>
      parseEnv(validEnv({ SOURCE_EXAMPLESLUG_KEY: "short" })),
    ).toThrow(/SOURCE_EXAMPLESLUG_KEY/);
  });

  it("accepts 32+ char SOURCE_<SLUG>_KEY values", () => {
    const env = parseEnv(validEnv({ SOURCE_EXAMPLESLUG_KEY: "k".repeat(40) }));
    expect(env.SOURCE_EXAMPLESLUG_KEY).toBe("k".repeat(40));
  });
});

describe("EnvValidationError — safe issue contract", () => {
  it("carries structured safe issues (name + reason, no values)", () => {
    try {
      parseEnv(validEnv({ AGE_SECRET: WEAK_SECRET, SITE_URL: "http://x.com" }));
      expect.unreachable("parseEnv should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvValidationError);
      const issues = (error as EnvValidationError).safeIssues;
      const names = issues.map((issue) => issue.varName);
      expect(names).toContain("AGE_SECRET");
      expect(names).toContain("SITE_URL");
      for (const issue of issues) {
        expect(issue.reason).not.toContain(WEAK_SECRET);
        expect(issue.reason).not.toContain("http://x.com");
      }
    }
  });
});

describe("bootValidateEnv — fail-closed boot gate", () => {
  it("logs a safe message and exits 1 on an invalid environment", () => {
    const exit = vi.fn();
    const log = vi.fn();
    // After a real process.exit(1) the process is dead; with an injected
    // non-terminating exit the error must propagate (fail-loud — the caller
    // can never proceed as if the environment were valid).
    expect(() =>
      bootValidateEnv({
        source: validEnv({ AGE_SECRET: WEAK_SECRET }),
        exit,
        log,
      }),
    ).toThrow(EnvValidationError);
    expect(exit).toHaveBeenCalledWith(1);
    expect(log).toHaveBeenCalledTimes(1);
    const logged = log.mock.calls[0]?.[0] as string;
    expect(logged).toContain("boot aborted");
    expect(logged).toContain("AGE_SECRET");
    expect(logged).not.toContain(WEAK_SECRET);
  });

  it("returns the environment without exiting when valid", () => {
    const exit = vi.fn();
    const log = vi.fn();
    const env = bootValidateEnv({ source: validEnv(), exit, log });
    expect(env.SITE_NAME).toBe("SYCONIA");
    expect(exit).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });
});

describe("getEnv — cached accessor", () => {
  it("parses process.env once and caches the result", () => {
    for (const [key, value] of Object.entries(validEnv())) {
      vi.stubEnv(key, value as string);
    }
    const first = getEnv();
    const second = getEnv();
    expect(first).toBe(second);
    expect(first.SITE_URL).toBe("https://example.com");
    expect(first.AGE_LEAVE_URL).toBe("https://www.wikipedia.org");
  });
});

describe(".env.example coverage parity (ARCHITECTURE §12)", () => {
  it("documents every concrete §12 variable", () => {
    const example = readFileSync(resolve(process.cwd(), ".env.example"), "utf8");
    const documented = new Set(
      [...example.matchAll(/^([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1]),
    );
    const concrete = [
      "DATABASE_URL",
      "DATABASE_POOL_URL",
      "AGE_SECRET",
      "CURSOR_SECRET",
      "SESSION_SECRET",
      "CRON_SECRET",
      "ADMIN_USERNAME",
      "ADMIN_PASSWORD_HASH",
      "SITE_URL",
      "SITE_NAME",
      "LOG_LEVEL",
      "AGE_LEAVE_URL",
    ];
    for (const name of concrete) {
      expect(documented.has(name), `${name} must be documented in .env.example`).toBe(
        true,
      );
    }
  });
});
