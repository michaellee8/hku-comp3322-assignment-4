import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleError } from "./handleError";

interface DisplayState {
  showError: boolean;
  errorMsg: string;
  showDrawer: boolean;
  showRegisterPopup: boolean;
  currentUserID: string;
  showContent: boolean;
}

const initialState: DisplayState = {
  errorMsg: "",
  showDrawer: false,
  showError: false,
  showRegisterPopup: false,
  currentUserID: "",
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
      state.showDrawer = false;
      state.errorMsg = "";
    },
    setDrawer(state, action: PayloadAction<boolean>) {
      state.showDrawer = action.payload;
    },
    setRegisterPopup(state, action: PayloadAction<boolean>) {
      state.showRegisterPopup = action.payload;
    },
    initUserID(state, action: PayloadAction<string>) {
      state.showContent = true;
      state.currentUserID = action.payload;
    },
    destroyUserID(state) {
      state.showContent = false;
      state.currentUserID = "";
    }
  }
});

export const {
  hideError,
  setDrawer,
  setRegisterPopup,
  showError,
  initUserID,
  destroyUserID
} = displaySlice.actions;

export const displayReducer = displaySlice.reducer;
