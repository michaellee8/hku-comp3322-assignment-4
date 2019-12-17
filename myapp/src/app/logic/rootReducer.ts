import { combineReducers } from "@reduxjs/toolkit";

import { albumSelectorReducer } from "./albumSelectorSlice";
import { displayReducer } from "./displaySlice";
import { registerReducer } from "./registerSlice";
import { loginReducer } from "./loginSlice";
import { albumPageReducer } from "./albumPageSlice";

const rootReducer = combineReducers({
  albumSelector: albumSelectorReducer,
  display: displayReducer,
  register: registerReducer,
  login: loginReducer,
  albumPage: albumPageReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
