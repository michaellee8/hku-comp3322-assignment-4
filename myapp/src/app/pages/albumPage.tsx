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
import { Box } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { drawerWidth } from "./albumSelector";

const useStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  },
  dialogImage: {
    maxHeight: 400,
    maxWidth: 500
  },
  panel: { width: `calc(100% - ${drawerWidth}px)`, marginLeft: drawerWidth }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AlbumPage: React.FC = () => {
  const classes = useStyles();
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
  if (!photos || !Array.isArray(photos)) {
    return null;
  }
  return (
    <React.Fragment>
      <Box
        display={"flex"}
        flexDirection={"row"}
        flexWrap={"wrap"}
        className={classes.panel}
      >
        {photos.map(photo => (
          <Card className={classes.card}>
            <CardActionArea onClick={() => dispatch(selectPhoto(photo.id))}>
              {/*<CardMedia className={classes.media} image={photo.url} />*/}
              <img src={photo.url} className={classes.media} />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {photo.likedBy && photo.likedBy.length > 0
                    ? `${photo.likedBy
                        .map(l => l.username)
                        .join(", ")} liked this photo!`
                    : null}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
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
                {isOwnAlbum ? (
                  <span>Delete</span>
                ) : photo.likedBy.find(u => u.userID === currentUserID) ? (
                  <span>Unlike</span>
                ) : (
                  <span>Like</span>
                )}
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <img
            src={photos.find(p => p.id === selectedPhoto)?.url}
            className={classes.dialogImage}
          />
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
