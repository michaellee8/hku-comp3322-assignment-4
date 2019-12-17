import { combineReducers } from "@reduxjs/toolkit";

import { albumSelectorReducer } from "./albumSelectorSlice";
import { displayReducer } from "./displaySlice";
import { registerReducer } from "./registerSlice";
import { loginReducer } from "./loginSlice";

const rootReducer = combineReducers({
  albumSelector: albumSelectorReducer,
  display: displayReducer,
  register: registerReducer,
  login: loginReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
