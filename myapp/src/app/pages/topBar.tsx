import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../logic/rootReducer";
import { setUsername, setPassword } from "../logic/loginSlice";
import { ChangeHandler } from "../../utils";
import TextField from "@material-ui/core/TextField";
import { loginUser, logoutUser } from "../logic/loginSlice";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { setRegisterPopup } from "../logic/displaySlice";
import { drawerWidth } from "./albumSelector";

const useStyles = makeStyles(theme => ({
  grow: { flexGrow: 1 },
  textField: { backgroundColor: fade(theme.palette.common.white, 0.15) },
  appBar: { width: `calc(100% - ${drawerWidth}px)`, marginLeft: drawerWidth },
  mar: { marginLeft: theme.spacing(1), marginRight: theme.spacing(1) }
}));

export const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const showContent = useSelector(
    (state: RootState) => state.display.showContent
  );
  const { username, loading, password } = useSelector(
    (state: RootState) => state.login
  );
  const currentUsername = useSelector(
    (state: RootState) => state.display.currentUsername
  );
  const handleUsername: ChangeHandler = event =>
    dispatch(setUsername(event.target.value));
  const handlePassword: ChangeHandler = event =>
    dispatch(setPassword(event.target.value));
  const handleLogin = () => dispatch(loginUser());
  const handleLogout = () => dispatch(logoutUser());
  const handleOpenRegister = () => dispatch(setRegisterPopup(true));
  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          iAlbum
        </Typography>
        <div className={classes.grow} />
        {!showContent ? (
          <React.Fragment>
            <TextField
              label="Username"
              variant="outlined"
              color="secondary"
              onChange={handleUsername}
              classes={{ root: classes.textField }}
              className={classes.mar}
            />
            <TextField
              label="Password"
              variant="outlined"
              color="secondary"
              type="password"
              onChange={handlePassword}
              classes={{ root: classes.textField }}
              className={classes.mar}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogin}
              className={classes.mar}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenRegister}
              className={classes.mar}
            >
              Register
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="subtitle1" noWrap className={classes.mar}>
              {`Hello ${currentUsername}!`}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              className={classes.mar}
            >
              Logout
            </Button>
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};
