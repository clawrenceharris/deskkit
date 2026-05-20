import { describe, expect, it, vi } from "vitest";
import {
  AppErrorCode,
} from "@/types";
import {
  ApplicationError,
  errorMessages,
  getUserErrorMessage,
  logError,
  normalizeError,
} from "../errors";

describe("normalizeError", () => {
  it("preserves application errors as user-facing messages", () => {
    const error = normalizeError(new ApplicationError({code: AppErrorCode.UNKNOWN_ERROR, message:"Custom failure"}));

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.message).toBe("Custom failure");
  });

  it("maps common Supabase authentication messages", () => {
    expect(normalizeError({ message: "Invalid login credentials" })).toMatchObject({
      name: "ApplicationError",
      code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
      message: errorMessages[AppErrorCode.AUTH_INVALID_CREDENTIALS],
    });

    expect(normalizeError({ message: "Email not confirmed" })).toMatchObject({
      name: "ApplicationError",
      code: AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
      message: errorMessages[AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED],
    });

    expect(normalizeError({ message: "User already registered" })).toMatchObject({
      name: "ApplicationError",
      code: AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
      message: errorMessages[AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS],
    });
  });

  it("maps Prisma unique constraint failures to conflict errors", () => {
    const prismaError = {
      name: "PrismaClientKnownRequestError",
      code: "P2002",
      meta: { target: ["email"] },
      message: "Unique constraint failed on the fields: (`email`)",
    } as unknown as { name: string; code: string; meta: object; message: string };

    const normalized = normalizeError(prismaError);

    expect(normalized).toBeInstanceOf(ApplicationError);
    expect(normalized).toMatchObject({
      code: AppErrorCode.RESOURCE_ALREADY_EXISTS,
      userMessage: errorMessages[AppErrorCode.RESOURCE_ALREADY_EXISTS],
    });
  });

  it("maps Supabase authorization and throttling errors to safe messages", () => {
    expect(normalizeError({ message: "Unauthorized", status: 401 })).toMatchObject({
      code: AppErrorCode.AUTH_UNAUTHENTICATED,
      userMessage: errorMessages[AppErrorCode.AUTH_UNAUTHENTICATED],
    });
    expect(normalizeError({ message: "Too many requests", status: 429 })).toMatchObject({
      code: AppErrorCode.RATE_LIMITED,
      userMessage: errorMessages[AppErrorCode.RATE_LIMITED],
    });
  });

  it("maps file size and network failures to safe messages", () => {
    expect(normalizeError({ message: "body size limit exceeded" })).toMatchObject({
      code: AppErrorCode.FILE_TOO_LARGE,
      userMessage: errorMessages[AppErrorCode.FILE_TOO_LARGE],
    });

    expect(normalizeError({ message: "database unavailable", status: 503 })).toMatchObject({
      code: AppErrorCode.EXTERNAL_SERVICE_ERROR,
      userMessage: errorMessages[AppErrorCode.EXTERNAL_SERVICE_ERROR],
    });

    expect(normalizeError(new TypeError("fetch failed"))).toMatchObject({
      name: "ApplicationError",
      message: errorMessages[AppErrorCode.NETWORK_OFFLINE],
    });
  });

  it("falls back to unknown error messages without leaking details", () => {
    const error = normalizeError(new Error("postgres password leaked"));

    expect(error.message).toBe(errorMessages[AppErrorCode.UNKNOWN_ERROR]);
    expect(error).toMatchObject({
      code: AppErrorCode.UNKNOWN_ERROR,
      metadata: { originalMessage: "postgres password leaked" },
    });
  });

  it("handles unknown thrown values", () => {
    const error = normalizeError("bad value");

    expect(error.message).toBe(errorMessages[AppErrorCode.UNKNOWN_ERROR]);
    expect(error).toMatchObject({
      code: AppErrorCode.UNKNOWN_ERROR,
      metadata: { originalError: "bad value" },
    });
  });
});

describe("getUserErrorMessage", () => {
  it("returns the normalized message", () => {
    expect(getUserErrorMessage({ message: "Invalid login credentials" })).toBe(
      errorMessages[AppErrorCode.AUTH_INVALID_CREDENTIALS],
    );
  });
});

describe("logError", () => {
  it("logs in development with context", () => {
    vi.stubEnv("NODE_ENV", "development");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new ApplicationError({
      code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
      message: "Invalid email or password.",
    });

    logError(error, { feature: "auth" });

    expect(consoleError).toHaveBeenCalledWith(
      "App Error:",
      expect.objectContaining({
        code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
        context: { feature: "auth" },
      }),
    );

    consoleError.mockRestore();
    vi.unstubAllEnvs();
  });
});
