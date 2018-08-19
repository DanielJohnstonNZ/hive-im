import { Server } from "ws";
import * as http from "http";
import * as debug from "debug";
import { Peer } from "./Peer";
import { MetaData, MetaDataType } from "..";

import * as WebSocket from "ws";

const LogWebSocket = (data: any) => debug("websocket")(data);

export class PeerHandler {
  private socket: Server;
  private clients: Peer[];

  constructor(connection: http.Server) {
    this.clients = [];

    this.socket = new Server({ server: connection });
    this.socket.on("connection", (socket: WebSocket) =>
      this.handleNewPeer(socket)
    );
  }

  private handleNewPeer(socket: WebSocket) {
    let peer: Peer = new Peer(socket);

    LogWebSocket("Connection Opened: " + peer.id);

    // add the new client to the directory.
    peer.onMessage = (message: MetaData) => {
      let destinationId: string = message.id;

      message.id = peer.id;

      this.clients
        .filter((val: Peer) => val.id === destinationId)
        .forEach((val: Peer) => val.message(message));
    };

    peer.onBroadcast = (message: MetaData) => {
      this.clients
        .filter(
          (val: Peer) =>
            peer.room !== "" && peer.room === val.room && peer.id !== val.id
        )
        .forEach((value: Peer) => value.message(message));
    };

    peer.onDisconnect = () => {
      LogWebSocket("Connection Closed: " + peer.id);

      this.clients.splice(
        this.clients.findIndex((value: Peer) => value.id === peer.id),
        1
      );
    };

    this.clients.push(peer);
  }
}
