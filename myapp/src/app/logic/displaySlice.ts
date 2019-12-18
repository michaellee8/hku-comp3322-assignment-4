import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleError } from "./handleError";

interface DisplayState {
  showError: boolean;
  errorMsg: string;
  showDrawer: boolean;
  showRegisterPopup: boolean;
  currentUserID: string;
  currentUsername: string;
  showContent: boolean;
}

const initialState: DisplayState = {
  errorMsg: "",
  showDrawer: false,
  showError: false,
  showRegisterPopup: false,
  currentUserID: "",
  currentUsername: "",
  showContent: false
};

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    showError(state, action: PayloadAction<string>) {
      state.showError = true;
      state.errorMsg = action.payload;
    },
    hideError(state) {
      state.showError = false;
      state.errorMsg = "";
    },
    setDrawer(state, action: PayloadAction<boolean>) {
      state.showDrawer = action.payload;
    },
    setRegisterPopup(state, action: PayloadAction<boolean>) {
      state.showRegisterPopup = action.payload;
    },
    initUser(
      state,
      action: PayloadAction<{ username: string; userID: string }>
    ) {
      state.showContent = true;
      state.currentUserID = action.payload.userID;
      state.currentUsername = action.payload.username;
    },
    destroyUser(state) {
      state.showContent = false;
      state.currentUserID = "";
      state.currentUsername = "";
    }
  }
});

export const {
  hideError,
  setDrawer,
  setRegisterPopup,
  showError,
  initUser,
  destroyUser
} = displaySlice.actions;

export const displayReducer = displaySlice.reducer;
