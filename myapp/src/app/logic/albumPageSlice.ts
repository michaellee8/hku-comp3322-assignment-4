import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAlbum,
  Photo,
  updateLike,
  uploadPhoto,
  deletePhoto
} from "../../api/albumService";
import { AppThunk } from "./store";
import { handleError } from "./handleError";

interface AlbumPageState {
  photos: Photo[];
  selectedPhoto: string;
  loading: boolean;
  uploadingPhoto: boolean;
}

const initialState: AlbumPageState = {
  photos: [],
  selectedPhoto: "",
  loading: false,
  uploadingPhoto: false
};

const albumPageSlice = createSlice({
  name: "albumPage",
  initialState,
  reducers: {
    fetchPhotosStart(state) {
      state.loading = true;
    },
    fetchPhotosSuccess(state, action: PayloadAction<Photo[]>) {
      state.loading = false;
      state.photos = action.payload;
    },
    fetchPhotosFailure(state) {
      state.loading = true;
    },
    selectPhoto(state, action: PayloadAction<string>) {
      state.selectedPhoto = action.payload;
    },
    closePhoto(state) {
      state.selectedPhoto = "";
    },
    setUploadingPhoto(state, action: PayloadAction<boolean>) {
      state.uploadingPhoto = action.payload;
    }
  }
});

export const {
  closePhoto,
  fetchPhotosFailure,
  fetchPhotosStart,
  fetchPhotosSuccess,
  selectPhoto,
  setUploadingPhoto
} = albumPageSlice.actions;

export const albumPageReducer = albumPageSlice.reducer;

export const fetchPhotos = (): AppThunk => async (dispatch, getState) => {
  try {
    const { selectedAlbum } = getState().albumSelector;
    dispatch(fetchPhotosStart());
    const result = await getAlbum(selectedAlbum);
    dispatch(fetchPhotosSuccess(result.photos));
  } catch (e) {
    dispatch(fetchPhotosFailure());
    console.log(e);
    dispatch(handleError("cannot fetch album"));
  }
};

export const uploadAlbumPhoto = (photo: File): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(setUploadingPhoto(true));
    const result = await uploadPhoto(photo);
    dispatch(setUploadingPhoto(false));
    dispatch(fetchPhotos());
  } catch (e) {
    dispatch(setUploadingPhoto(false));
    console.log(e);
    dispatch(handleError("cannot upload photo"));
  }
};

export const deleteAlbumPhoto = (photoID: string): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const result = await deletePhoto(photoID);
    dispatch(fetchPhotos());
  } catch (e) {
    console.log(e);
    dispatch(handleError("cannot delete photo"));
  }
};

export const toggleLikePhoto = (photoID: string): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const result = await updateLike(photoID);
    dispatch(fetchPhotos());
  } catch (e) {
    console.log(e);
    dispatch(handleError("cannot like photo"));
  }
};
