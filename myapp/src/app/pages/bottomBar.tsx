import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../logic/rootReducer";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useDropzone } from "react-dropzone";
import {
  deleteAlbumPhoto,
  toggleLikePhoto,
  uploadAlbumPhoto
} from "../logic/albumPageSlice";
import { drawerWidth } from "./albumSelector";

const useStyles = makeStyles({
  appBar: {
    top: "auto",
    bottom: 0,
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  grow: {
    flexGrow: 1
  }
});

export const BottomBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: [".jpg", ".png"]
  });

  const mode: "photo-uploader" | "delete" | "like" | null = useSelector(
    (state: RootState) => {
      if (
        !state.albumPage.selectedPhoto &&
        state.albumSelector.selectedAlbum === state.display.currentUserID
      ) {
        return "photo-uploader";
      }
      if (state.albumPage.selectedPhoto) {
        if (state.albumSelector.selectedAlbum === state.display.currentUserID) {
          return "delete";
        } else {
          return "like";
        }
      }
      return null;
    }
  );

  const currentSelectedPhoto: string | null = useSelector(
    (state: RootState) => {
      if (!state.albumPage.selectedPhoto) {
        return null;
      }
      return state.albumPage.selectedPhoto;
    }
  );

  const showContent = useSelector(
    (state: RootState) => state.display.showContent
  );

  const friendNames: string[] | null = useSelector((state: RootState) => {
    if (!state.albumPage.selectedPhoto) {
      return null;
    }
    return state.albumPage.photos
      .find(p => p.id === currentSelectedPhoto)!
      .likedBy.map(u => u.username);
  });

  const handleUploadPhoto = async () => {
    dispatch(uploadAlbumPhoto(acceptedFiles[0]));
  };

  const handleChoosePhoto = () => {
    open();
  };

  const handleDelete = async () => {
    if (currentSelectedPhoto) {
      dispatch(deleteAlbumPhoto(currentSelectedPhoto));
    }
  };

  const handleLike = async () => {
    if (currentSelectedPhoto) {
      dispatch(toggleLikePhoto(currentSelectedPhoto));
    }
  };

  if (mode === null) {
    return null;
  }

  if (!showContent) {
    return null;
  }

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        {mode === "photo-uploader" ? (
          <React.Fragment>
            <input {...getInputProps()} />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleChoosePhoto}
            >
              Choose Photo
            </Button>
            <Typography variant="subtitle1" noWrap>
              {acceptedFiles && acceptedFiles[0]
                ? `${acceptedFiles[0].name} is chosen`
                : "No photo chosen"}
            </Typography>
            <div className={classes.grow} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadPhoto}
            >
              Upload
            </Button>
          </React.Fragment>
        ) : mode === "delete" || mode === "like" ? (
          <React.Fragment>
            {friendNames && friendNames.length > 0 ? (
              <Typography variant="subtitle1" noWrap>
                {`${friendNames?.join(", ")} liked this photo!`}
              </Typography>
            ) : null}
            <div className={classes.grow} />
            <Button
              variant="contained"
              color="primary"
              onClick={mode === "delete" ? handleDelete : handleLike}
            >
              {mode === "delete" ? "Delete" : "Like"}
            </Button>
          </React.Fragment>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};
