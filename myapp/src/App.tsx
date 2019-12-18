import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./app/logic/rootReducer";
import { store } from "./app/logic/store";
import { CssBaseline } from "@material-ui/core";
import { TopBar } from "./app/pages/topBar";
import { RegisterPage } from "./app/pages/registerPage";
import { AlbumPage } from "./app/pages/albumPage";
import { BottomBar } from "./app/pages/bottomBar";
import { AlbumSelector } from "./app/pages/albumSelector";
import { hideError } from "./app/logic/displaySlice";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const showContent = useSelector(
    (state: RootState) => state.display.showContent
  );
  const { showError, errorMsg } = useSelector((state: RootState) => ({
    errorMsg: state.display.errorMsg,
    showError: state.display.showError
  }));
  const handleCloseError = () => dispatch(hideError());
  return (
    <React.Fragment>
      <CssBaseline />
      <BottomBar />
      <TopBar />
      <RegisterPage />
      {showContent ? (
        <React.Fragment>
          <AlbumPage />

          <AlbumSelector />
        </React.Fragment>
      ) : null}
      <Snackbar
        open={showError}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMsg}
        action={[
          <IconButton key="close" color="inherit" onClick={handleCloseError}>
            <CloseIcon />
          </IconButton>
        ]}
      />
    </React.Fragment>
  );
};

export default App;
