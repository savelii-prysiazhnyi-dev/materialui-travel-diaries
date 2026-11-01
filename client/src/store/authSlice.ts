import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
}

export interface LoginPayload {
  userId: string;
  name: string;
  email: string;
}

const getStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return null;
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore in environments with blocked storage
    }
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};

const initialUserId = getStorageItem("userId");
const initialUserName = getStorageItem("userName");
const initialUserEmail = getStorageItem("userEmail");

const initialState: AuthState = {
  isLoggedIn: Boolean(initialUserId),
  userId: initialUserId,
  userName: initialUserName,
  userEmail: initialUserEmail
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      const { userId, name, email } = action.payload;
      state.isLoggedIn = true;
      state.userId = userId;
      state.userName = name;
      state.userEmail = email;

      setStorageItem("userId", userId);
      if (name) setStorageItem("userName", name);
      if (email) setStorageItem("userEmail", email);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.userName = null;
      state.userEmail = null;

      removeStorageItem("userId");
      removeStorageItem("userName");
      removeStorageItem("userEmail");
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
