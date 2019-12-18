import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../logic/rootReducer";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { deleteAlbumPhoto, toggleLikePhoto } from "../logic/albumPageSlice";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import DeleteIcon from "@material-ui/icons/Delete";
import LikeIcon from "@material-ui/icons/ThumbUp";
import UnlikeIcon from "@material-ui/icons/ThumbDown";
import IconButton from "@material-ui/core/IconButton";
import { selectPhoto } from "../logic/albumPageSlice";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AlbumPage: React.FC = () => {
  const dispatch = useDispatch();
  const getLikeHandler = (photoID: string) => () =>
    dispatch(toggleLikePhoto(photoID));
  const getDeleteHandler = (photoID: string) => () =>
    dispatch(deleteAlbumPhoto(photoID));
  const { photos, selectedPhoto, loading } = useSelector(
    (state: RootState) => state.albumPage
  );
  const isOwnAlbum = useSelector(
    (state: RootState) =>
      state.albumSelector.selectedAlbum === state.display.currentUserID
  );
  const isDialogOpen = useSelector(
    (state: RootState) => !!state.albumPage.selectedPhoto
  );
  const currentUserID = useSelector(
    (state: RootState) => state.display.currentUserID
  );
  const handleCloseDialog = () => dispatch(selectPhoto(""));
  return (
    <React.Fragment>
      <GridList cellHeight={250}>
        {photos.map(photo => (
          <GridListTile
            key={photo.id}
            onClick={() => dispatch(selectPhoto(photo.id))}
          >
            <img src={photo.url} />
            <GridListTileBar
              subtitle={
                <span>
                  {photo.likedBy && photo.likedBy.length > 0
                    ? `${photo.likedBy
                        .map(l => l.username)
                        .join(", ")} liked this photo!`
                    : null}
                </span>
              }
              actionIcon={
                <IconButton
                  onClick={
                    isOwnAlbum
                      ? getDeleteHandler(photo.id)
                      : photo.likedBy.find(u => u.userID === currentUserID)
                      ? getLikeHandler(photo.id)
                      : getLikeHandler(photo.id)
                  }
                >
                  {isOwnAlbum ? (
                    <DeleteIcon />
                  ) : photo.likedBy.find(u => u.userID === currentUserID) ? (
                    <UnlikeIcon />
                  ) : (
                    <LikeIcon />
                  )}
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <img src={photos.find(p => p.id === selectedPhoto)?.url} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
