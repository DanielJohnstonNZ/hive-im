import { IActions, WebSocketState } from ".";

export function reducer(
  state: WebSocketState = new WebSocketState(),
  action: IActions
): WebSocketState {
  console.log(action);
  switch (action.type) {
    case "websocket/SOCKET_CONNECTED":
      return {
        ...state,
        connected: true,
        connecting: false
      };
    case "websocket/SOCKET_CONNECTING":
      return { ...state, connected: false, connecting: true };
    case "websocket/SOCKET_DISCONNECTED":
      return { ...state, connected: false, connecting: false };
  }

  return state;
}
