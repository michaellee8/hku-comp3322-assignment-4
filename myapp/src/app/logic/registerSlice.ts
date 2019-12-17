import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { register } from "../../api/albumService";
import { AppThunk } from "./store";
import { handleError } from "./handleError";

interface RegisterState {
  username: string;
  password: string;
  rePassword: string;
  loading: boolean;
  message: string;
}

const initialState: RegisterState = {
  username: "",
  password: "",
  rePassword: "",
  loading: false,
  message: ""
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setRePassword(state, action: PayloadAction<string>) {
      state.rePassword = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    resetToInitialState(state) {
      state.username = "";
      state.password = "";
      state.rePassword = "";
      state.loading = false;
      state.message = "";
    },
    resetTextField(state) {
      state.username = "";
      state.password = "";
      state.rePassword = "";
    },
    registerStart(state) {
      state.loading = true;
    },
    registerSuccess(state) {
      state.loading = false;
    },
    registerFailure(state) {
      state.loading = false;
    }
  }
});

export const {
  setLoading,
  registerFailure,
  registerStart,
  registerSuccess,
  resetToInitialState,
  setMessage,
  setPassword,
  setRePassword,
  setUsername,
  resetTextField
} = registerSlice.actions;

export const registerReducer = registerSlice.reducer;

export const registerNewUser = (): AppThunk => async (dispatch, getState) => {
  try {
    const { username, password, rePassword } = getState().register;
    if (password !== rePassword) {
      dispatch(handleError("password must match re-entered password"));
      dispatch(setMessage("password must match re-entered password"));
      return;
    }
    dispatch(registerStart());
    const result = await register(username, password);
    dispatch(registerSuccess());
    dispatch(setMessage("register success"));
    dispatch(resetTextField());
  } catch (e) {
    console.log(e);
    dispatch(registerFailure());
    dispatch(handleError("cannot register"));
  }
};
