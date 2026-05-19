import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAsyncAction } from "../useAsyncAction";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";
import { fail } from "@/shared/application";

describe("useAsyncAction", () => {
  it("returns successful data and toggles loading", async () => {
    const { result } = renderHook(() => useAsyncAction<{ id: string }>());

    let promise: Promise<unknown>;

    act(() => {
      promise = result.current.execute(async () => ({
        success: true,
        data: { id: "desk-1" },
      }));
    });

    expect(result.current.isLoading).toBe(true);
    await expect(promise!).resolves.toEqual({
      success: true,
      data: { id: "desk-1" },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it("normalizes thrown errors from data actions", async () => {
    const { result } = renderHook(() => useAsyncAction<{ id: string }>());

    await act(async () => {
      const actionResult = await result.current.execute(async () => {
        throw new Error("internal details");
      });

      expect(actionResult).toEqual({
        success: false,
        error: "Something went wrong. Please try again later.",
      });
    });

    expect(result.current.error).toBe("Something went wrong. Please try again later.");
    expect(result.current.isLoading).toBe(false);
  });

  it("returns action failures without rewriting them", async () => {
    const { result } = renderHook(() => useAsyncAction());

    await expect(
      result.current.execute(async () => fail(new ApplicationError({code: AppErrorCode.DATABASE_ERROR, message: "Could not create desk"}))),  
    ).resolves.toEqual({
      success: false,
      error: new ApplicationError({code: AppErrorCode.DATABASE_ERROR, message: "Could not create desk"}),
    });

    expect(result.current.error).toBeNull();
  });
});
