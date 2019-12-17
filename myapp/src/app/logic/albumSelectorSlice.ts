import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getFriends,
  listUsers,
  toggleFriend,
  User
} from "../../api/albumService";
import { AppThunk } from "./store";
import { handleError } from "./handleError";
import { fetchPhotos } from "./albumPageSlice";

interface AlbumSelectorState {
  users: User[];
  friends: string[];
  selectedAlbum: string;
  loading: boolean;
}

const initialState: AlbumSelectorState = {
  users: [],
  friends: [],
  selectedAlbum: "",
  loading: true
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
    },
    setSelectedAlbum(state, action: PayloadAction<string>) {
      state.selectedAlbum = action.payload;
    },
    setFriends(state, action: PayloadAction<string[]>) {
      state.friends = action.payload;
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
  setSelectedAlbum,
  setFriends
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
    dispatch(getFriendsSuccess(result.friends.map(({ userID }) => userID)));
  } catch (err) {
    console.log(err);
    dispatch(getFriendsFailure());
    dispatch(handleError("cannot fetch friends"));
  }
};

export const selectAlbum = (album: string): AppThunk => async dispatch => {
  dispatch(setSelectedAlbum(album));
  dispatch(fetchPhotos);
};

export const toggleFriendUser = (
  friendID: string
): AppThunk => async dispatch => {
  try {
    const result = await toggleFriend(friendID);
    dispatch(fetchFriends());
  } catch (e) {
    console.log(e);
  }
};
