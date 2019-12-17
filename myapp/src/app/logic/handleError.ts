import {AppThunk} from "./store";
import {showError} from "./displaySlice"

export const handleError = (msg: string): AppThunk => async dispatch => {
  // alert(
  //     `${msg}
  // refresh this page if problem persist`
  // );
  dispatch(showError(msg));
};