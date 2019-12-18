import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, LoginError, logout } from "../../api/albumService";
import { AppThunk } from "./store";
import { handleError } from "./handleError";
import { initUser, destroyUser } from "./displaySlice";
import { selectAlbum } from "./albumSelectorSlice";

interface LoginState {
  username: string;
  password: string;
  loading: boolean;
}

const initialState: LoginState = {
  username: "",
  password: "",
  loading: false
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetTextField(state) {
      state.username = "";
      state.password = "";
    },
    loginStart(state) {
      state.loading = true;
    },
    loginSuccess(state) {
      state.loading = false;
    },
    loginFailure(state) {
      state.loading = false;
    }
  }
});

export const {
  resetTextField,
  setUsername,
  setPassword,
  setLoading,
  loginFailure,
  loginStart,
  loginSuccess
} = loginSlice.actions;

export const loginReducer = loginSlice.reducer;

export const loginUser = (): AppThunk => async (dispatch, getState) => {
  try {
    const { username, password } = getState().login;
    dispatch(loginStart());
    const result = await login(username, password);
    dispatch(loginSuccess());
    dispatch(resetTextField());
    dispatch(initUser({ userID: result.userID, username: username }));
    dispatch(selectAlbum(result.userID));
  } catch (err) {
    console.log(err);
    dispatch(loginFailure());
    if (err instanceof LoginError) {
      dispatch(
        handleError(
          "login information is incorrect, pls check your username and password"
        )
      );
    } else {
      dispatch(handleError("cannot login"));
    }
  }
};

export const logoutUser = (): AppThunk => async dispatch => {
  try {
    const result = await logout();
    dispatch(destroyUser());
  } catch (e) {
    console.log(e);
    dispatch(handleError("cannot logout"));
  }
};
