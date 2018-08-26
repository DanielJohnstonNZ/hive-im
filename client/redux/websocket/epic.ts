import { Observable } from "rxjs";
import { Epic, combineEpics } from "redux-observable";

import { IActions } from "..";

import { fromEvent } from "rxjs/observable/fromEvent";
import {
  ISocketMessageAction,
  ISocketSendAction,
  socketConnected,
  socketDisconnected,
  socketMessage,
  WebSocketState
} from ".";
import {
  socketSelectRoom,
  socketConnecting,
  socketSend,
  ISocketSelectRoom,
  socketSent,
  ISocketSendSdpAction,
  ISocketSendIceAction
} from "./actions";

import { MetaDataType, MetaData } from "../../../common/metadata";

let connection: WebSocket;

const onConnecting: Epic<IActions, WebSocketState> = action$ =>
  action$
    .ofType("websocket/SOCKET_CONNECTING")
    .do(
      () => (connection = new WebSocket(location.origin.replace(/^http/, "ws")))
    )
    .mergeMap(() => {
      return Observable.merge(
        fromEvent(connection, "open").mapTo(socketConnected()),
        fromEvent(connection, "close")
          .do(() => (connection = null))
          .mapTo(socketDisconnected()),
        fromEvent(connection, "message").map(
          (event: any): ISocketMessageAction => {
            return socketMessage(JSON.parse(event.data));
          }
        )
      );
    });

// On a disconnect, try to reconnect to the websocket.
const onDisconnect: Epic<IActions, WebSocketState> = action$ =>
  action$.ofType("websocket/SOCKET_DISCONNECTED").mapTo(socketConnecting());

// TODO remove room select on connection once room selector added.
const onConnect: Epic<IActions, WebSocketState> = action$ =>
  action$.ofType("websocket/SOCKET_CONNECTED").mapTo(socketSelectRoom());

const onRoomSelct: Epic<IActions, WebSocketState> = action$ =>
  action$
    .ofType("websocket/SOCKET_SELECT_ROOM")
    .map((action: ISocketSelectRoom) =>
      socketSend({ type: MetaDataType.ROOM, id: "", payload: action.room })
    );

// on a send, send the message to the socket.
const onSocketSend: Epic<IActions, WebSocketState> = action$ =>
  action$
    .ofType("websocket/SOCKET_SEND")
    .do(
      (action: ISocketSendAction) =>
        connection && connection.send(JSON.stringify(action.message))
    )
    .map((action: ISocketSendAction) => socketSent(action.message));

// on a send, send the message to the socket.
const onSocketSendSdp: Epic<IActions, WebSocketState> = action$ =>
  action$
    .ofType("websocket/SOCKET_SEND_SDP")
    .do((action: ISocketSendSdpAction) => {
      let data: MetaData = new MetaData(
        action.id,
        MetaDataType.SDP,
        action.sdp
      );

      connection && connection.send(JSON.stringify(data));
    })
    .map((action: ISocketSendAction) => socketSent(action.message));

// on a send, send the message to the socket.
const onSocketSendIce: Epic<IActions, WebSocketState> = action$ =>
  action$
    .ofType("websocket/SOCKET_SEND_ICE")
    .do((action: ISocketSendIceAction) => {
      let data: MetaData = new MetaData(
        action.id,
        MetaDataType.ICE,
        action.candidate
      );

      connection && connection.send(JSON.stringify(data));
    })
    .map((action: ISocketSendAction) => socketSent(action.message));

// On app load, initiate the connection to the websocket.
const onAppLoad: Epic<IActions, WebSocketState> = action$ =>
  action$.ofType("APP_LOAD").mapTo(socketConnecting());

export const websocketEpic = combineEpics(
  onConnecting,
  onDisconnect,
  onConnect,
  onRoomSelct,
  onSocketSend,
  onSocketSendIce,
  onSocketSendSdp,
  onAppLoad
);
