export class Peer {
  id: string;
  displayName: string;
}

export class Message {
  public source: Peer;
  public destination: string;
  public type: MessageType;
  public body: any;
  public timestamp: Date;
}

export enum MessageType {
  HI = 0, // New Peer
  SDP = 1, // SDP Information
  ICE = 2, // ICE Information
  BYE = 3, // Peer Disconnected
  TEXT = 4, // Text Message
  INFO = 5 // Info Message
}

export class AppState {
  messages: Message[];
  local: Peer; // Stores peer info about me.
  peers: Peer[];

  constructor() {
    this.messages = [];
    this.peers = [];
  }
}
