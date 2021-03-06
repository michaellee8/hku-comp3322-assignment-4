import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../logic/rootReducer";
import {
  selectAlbum,
  setSelectedAlbum,
  toggleFriendUser
} from "../logic/albumSelectorSlice";
import { Drawer } from "@material-ui/core";
import { toggleLikePhoto } from "../logic/albumPageSlice";
import { toggleFriend } from "../../api/albumService";

export const drawerWidth = 250;

const useStyles = makeStyles({
  list: {
    width: drawerWidth
  }
});

export const AlbumSelector: React.FC = () => {
  const dispatch = useDispatch();
  const usersList = useSelector((state: RootState) => {
    const { users, friends } = state.albumSelector;
    return users
      .map(u => ({ ...u, isFriend: friends.includes(u.userID) }))
      .filter(u => u.userID !== state.display.currentUserID);
  });
  const currentUserID = useSelector(
    (state: RootState) => state.display.currentUserID
  );
  const classes = useStyles();
  return (
    <Drawer open variant="permanent">
      <div className={classes.list} role="presentation">
        <List>
          <ListItem
            button
            key={currentUserID}
            onClick={() => dispatch(selectAlbum(currentUserID))}
          >
            <ListItemText primary={"My Album"} />
          </ListItem>
          {usersList.map(user => (
            <ListItem
              button
              key={user.userID}
              onClick={() => dispatch(selectAlbum(user.userID))}
            >
              <ListItemText primary={`${user.username}'s Album`} />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    dispatch(toggleFriendUser(user.userID));
                  }}
                >
                  {user.isFriend ? "Friend" : "Add"}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};
