import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getFriends, listUsers, User} from "../../api/albumService";
import {AppThunk} from "./store";
import {handleError} from "./handleError";

interface AlbumSelectorState {
  users: User[];
  friends: string[];
  loading: boolean;
}

const initialState: AlbumSelectorState = {
  users: [],
  friends: [],
  loading: true,
};

const albumSelectorSlice = createSlice({
  name: "albumSelector",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    getUsersStart(state) {
      state.loading = true;
    },
    getUsersSuccess(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.loading = false;
    },
    getUsersFailure(state) {
      state.loading = false;
    },
    getFriendsStart(state) {
      state.loading = true;
    },
    getFriendsSuccess(state, action: PayloadAction<string[]>) {
      state.friends = action.payload;
      state.loading = false;
    },
    getFriendsFailure(state) {
      state.loading = false;
    }
  }
});

export const {
  getFriendsFailure,
  getFriendsStart,
  getFriendsSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  setLoading,
} = albumSelectorSlice.actions;

export const albumSelectorReducer = albumSelectorSlice.reducer;

export const fetchUsers = (): AppThunk => async dispatch => {
  try {
    dispatch(getUsersStart());
    const result = await listUsers();
    dispatch(getUsersSuccess(result.users));
  } catch (err) {
    dispatch(getUsersFailure());
    dispatch(handleError("cannot fetch users"));
  }
};

export const fetchFriends = (): AppThunk => async dispatch => {
  try {
    dispatch(getFriendsStart());
    const result = await getFriends();
    dispatch(getFriendsSuccess(result.friends.map(({userID}) => userID)));
  } catch (err) {
    dispatch(getFriendsFailure());
    dispatch(handleError("cannot fetch friends"));
  }
};