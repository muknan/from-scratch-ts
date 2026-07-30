import { vi, expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import useThrottle from "./src/throttle/useThrottle";

test("calls the callback once on first invocation", () => {
  const mockCallBack = vi.fn();
  const { result } = renderHook(() => useThrottle(mockCallBack, 200));

  result.current();
  expect(mockCallBack).toHaveBeenCalledOnce();
});

test("does not call the callback twice for two rapid calls", () => {
  const mockCallBack = vi.fn();
  const { result } = renderHook(() => useThrottle(mockCallBack, 200));

  result.current();
  result.current();
  expect(mockCallBack).toHaveBeenCalledOnce();
});
