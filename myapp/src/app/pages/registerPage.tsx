import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../logic/rootReducer";
import { setRegisterPopup } from "../logic/displaySlice";
import {
  setUsername,
  setPassword,
  setRePassword,
  setMessage,
  setLoading,
  registerNewUser
} from "../logic/registerSlice";
import Dialog from "@material-ui/core/Dialog";
import { ChangeHandler } from "../../utils";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const { password, username, rePassword, message, loading } = useSelector(
    (state: RootState) => state.register
  );
  const open = useSelector(
    (state: RootState) => state.display.showRegisterPopup
  );
  const handleClose = () => dispatch(setRegisterPopup(false));
  const handleUsername: ChangeHandler = event =>
    dispatch(setUsername(event.target.value));
  const handlePassword: ChangeHandler = event =>
    dispatch(setPassword(event.target.value));
  const handleRePassword: ChangeHandler = event =>
    dispatch(setRePassword(event.target.value));
  const handleRegister = () => dispatch(registerNewUser());

  return (
    <Dialog open={open}>
      <DialogTitle>Register</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={handleUsername}
        />
        <TextField
          label="Password"
          variant="outlined"
          value={password}
          onChange={handlePassword}
        />
        <TextField
          label="Re-enter Password"
          variant="outlined"
          value={rePassword}
          onChange={handleRePassword}
        />
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleRegister} color="primary" disabled={loading}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};
