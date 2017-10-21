import {Peer} from "./peer"

export class Message{
    public source: Peer;
    public destination: string;
    public type: MessageType;
    public body: any;
    public timestamp: Date;
}

export enum MessageType{
    HI = 0, // New Peer
    SDP = 1, // SDP Information
    ICE = 2, // ICE Information
    BYE = 3, // Peer Disconnected
    TEXT = 4, // Text Message
    INFO = 5 // Info Message
}