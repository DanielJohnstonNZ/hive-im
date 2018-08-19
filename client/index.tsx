import { App } from "./app";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, Store, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware } from "redux-observable";

import { SupportCheck } from "./components";
import { epicRoot, reducerRoot, IRootState } from "./redux";

const epicMiddleware = createEpicMiddleware(epicRoot);

export const store: Store<IRootState> = createStore<IRootState>(
  reducerRoot,
  applyMiddleware(epicMiddleware)
);

ReactDOM.render(
  <SupportCheck>
    <Provider store={store}>
      <App />
    </Provider>
  </SupportCheck>,
  document.getElementById("app")
);
