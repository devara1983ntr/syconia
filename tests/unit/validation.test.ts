import { describe, expect, it } from "vitest";

import {
  ARGON2ID_MIN_MEMORY_KIB,
  ARGON2ID_MIN_PARALLELISM,
  ARGON2ID_MIN_TIME_COST,
  argon2idHashSchema,
  httpsUrlSchema,
  positiveIntSchema,
  postgresUrlSchema,
  secretSchema,
  toSafeIssues,
} from "@/lib/validation";
import { z } from "zod";

/**
 * M1-T007 validation primitives (SOP §3 "Zod at every boundary"; SECURITY
 * §11; .env.example header rules) — the shared schema home every boundary
 * schema composes.
 */

const VALID_ARGON2ID = `$argon2id$v=19$m=${ARGON2ID_MIN_MEMORY_KIB},t=${ARGON2ID_MIN_TIME_COST},p=${ARGON2ID_MIN_PARALLELISM}$c29tZXNhbHQ$ZGFoZGFoZGFoZGFoZGFoZGFoZGFoZA`;

describe("secretSchema (≥ 32 random chars, .env.example header rule)", () => {
  it("accepts 32+ characters", () => {
    expect(secretSchema.safeParse("a".repeat(32)).success).toBe(true);
    expect(secretSchema.safeParse("a".repeat(64)).success).toBe(true);
  });
  it("rejects shorter values", () => {
    expect(secretSchema.safeParse("a".repeat(31)).success).toBe(false);
    expect(secretSchema.safeParse("").success).toBe(false);
  });
});

describe("httpsUrlSchema", () => {
  it("accepts https URLs only", () => {
    expect(httpsUrlSchema.safeParse("https://example.com").success).toBe(true);
    expect(httpsUrlSchema.safeParse("http://example.com").success).toBe(false);
    expect(httpsUrlSchema.safeParse("notaurl").success).toBe(false);
  });
});

describe("postgresUrlSchema", () => {
  it("accepts postgres:// and postgresql://", () => {
    expect(
      postgresUrlSchema.safeParse("postgres://user:pass@host:5432/db").success,
    ).toBe(true);
    expect(
      postgresUrlSchema.safeParse("postgresql://user:pass@host:5432/db").success,
    ).toBe(true);
  });
  it("rejects other schemes", () => {
    expect(postgresUrlSchema.safeParse("mysql://host/db").success).toBe(false);
    expect(postgresUrlSchema.safeParse("https://host/db").success).toBe(false);
  });
});

describe("argon2idHashSchema (SECURITY §11 minimums)", () => {
  it("accepts a hash at the documented minimum parameters", () => {
    expect(argon2idHashSchema.safeParse(VALID_ARGON2ID).success).toBe(true);
  });
  it("rejects memory below 19 MiB", () => {
    const weak = VALID_ARGON2ID.replace("m=19456", "m=19455");
    const result = argon2idHashSchema.safeParse(weak);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain("memory");
  });
  it("rejects time cost below 2", () => {
    const weak = VALID_ARGON2ID.replace("t=2", "t=1");
    const result = argon2idHashSchema.safeParse(weak);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain("time");
  });
  it("rejects parallelism below 1", () => {
    const weak = VALID_ARGON2ID.replace("p=1", "p=0");
    const result = argon2idHashSchema.safeParse(weak);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain("parallelism");
  });
  it("rejects non-argon2id strings", () => {
    expect(
      argon2idHashSchema.safeParse("argon2id-hash-generated-via-npm-run").success,
    ).toBe(false);
    expect(argon2idHashSchema.safeParse("$argon2i$v=19$m=8,t=1,p=1$x$y").success).toBe(
      false,
    );
  });
});

describe("positiveIntSchema (RATE_LIMIT_* family)", () => {
  it("accepts positive integers", () => {
    expect(positiveIntSchema.safeParse("120").success).toBe(true);
    expect(positiveIntSchema.safeParse("1").success).toBe(true);
  });
  it("rejects zero, negatives, floats, non-numbers", () => {
    expect(positiveIntSchema.safeParse("0").success).toBe(false);
    expect(positiveIntSchema.safeParse("-5").success).toBe(false);
    expect(positiveIntSchema.safeParse("1.5").success).toBe(false);
    expect(positiveIntSchema.safeParse("abc").success).toBe(false);
    expect(positiveIntSchema.safeParse("").success).toBe(false);
  });
});

describe("toSafeIssues (never includes values)", () => {
  it("reports field names and reasons only", () => {
    const schema = z.object({ AGE_SECRET: secretSchema, SITE_URL: httpsUrlSchema });
    const result = schema.safeParse({
      AGE_SECRET: "short-secret-value",
      SITE_URL: "http://example.com",
    });
    expect(result.success).toBe(false);
    const issues = toSafeIssues(result.error as z.ZodError);
    expect(issues).toHaveLength(2);
    for (const issue of issues) {
      expect(issue.varName).toMatch(/^(AGE_SECRET|SITE_URL)$/);
      expect(typeof issue.reason).toBe("string");
    }
    const rendered = issues.map((i) => `${i.varName}: ${i.reason}`).join(" ");
    expect(rendered).not.toContain("short-secret-value");
    expect(rendered).not.toContain("http://example.com");
  });
});
