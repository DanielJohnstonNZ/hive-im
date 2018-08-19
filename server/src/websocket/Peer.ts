import * as uuid from "uuid/v4";
import { MetaData, MetaDataType } from "../";
import * as WebSocket from "ws";

// Represents a single user connection
export class Peer {
  constructor(connection: WebSocket) {
    this.connection = connection;
    this.id = uuid();

    connection.onmessage = (event: any) => this.handlePeerMessage(event);

    connection.onclose = () => this.onDisconnect();
  }

  public onMessage: (data: MetaData) => void;
  public onBroadcast: (data: MetaData) => void;
  public onDisconnect: () => void;

  private connection: WebSocket;

  public id: string;

  public room: string;

  public message(data: MetaData): void {
    if (this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(data));
    }
  }

  private handlePeerMessage(event: MessageEvent): void {
    var messageObj: MetaData;

    try {
      messageObj = JSON.parse(event.data);
    } catch (e) {
      return;
    }

    switch (messageObj.type) {
      case MetaDataType.ROOM:
        this.room = messageObj.payload;

        this.onBroadcast(new MetaData(this.id, MetaDataType.HI, null));
        break;
      case MetaDataType.SDP:
      case MetaDataType.ICE:
        this.onMessage(messageObj);
        break;
    }
  }
}
