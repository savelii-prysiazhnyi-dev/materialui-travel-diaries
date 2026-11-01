import { describe, it, expect, beforeEach } from "vitest";
import authReducer, { authActions, type AuthState } from "./authSlice.ts";

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, val: string): void => {
      store[key] = String(val);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    }
  };
})();

Object.defineProperty(globalThis, "window", {
  value: { localStorage: mockStorage },
  writable: true
});

describe("Auth Redux Slice", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it("should handle initial unauthenticated state", () => {
    const state = authReducer(undefined, { type: "unknown" });
    expect(state.isLoggedIn).toBe(false);
    expect(state.userId).toBe(null);
  });

  it("should update state on login action", () => {
    const state = authReducer(
      undefined,
      authActions.login({
        userId: "user-123",
        name: "Test User",
        email: "test@example.com"
      })
    );

    expect(state.isLoggedIn).toBe(true);
    expect(state.userId).toBe("user-123");
    expect(state.userName).toBe("Test User");
    expect(state.userEmail).toBe("test@example.com");
    expect(mockStorage.getItem("userId")).toBe("user-123");
  });

  it("should clear state on logout action", () => {
    const loggedInState: AuthState = {
      isLoggedIn: true,
      userId: "user-123",
      userName: "Test User",
      userEmail: "test@example.com"
    };

    const state = authReducer(loggedInState, authActions.logout());
    expect(state.isLoggedIn).toBe(false);
    expect(state.userId).toBe(null);
    expect(mockStorage.getItem("userId")).toBe(null);
  });
});
