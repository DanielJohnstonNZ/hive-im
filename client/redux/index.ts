export * from "./app";
export * from "./websocket";

import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";

import * as app from "./app";
import * as websocket from "./websocket";
import * as peers from "./peer";

export class IRootState {
  app: app.AppState;
  websocket: websocket.WebSocketState;
}

export type IActions = app.IActions | websocket.IActions | peers.IActions;

export const epicRoot = combineEpics(websocket.websocketEpic, peers.peerEpics);

export const reducerRoot = combineReducers<IRootState>({
  app: app.appReducer,
  websocket: websocket.reducer
});
