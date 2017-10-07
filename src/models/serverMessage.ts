export class ServerMessage{
    public source: string;
    public destination: string;
    public type: ServerMessageType;
    public body: any;
    public isProcessed: boolean;
}

export enum ServerMessageType{
    HI = 0, // New Peer
    SDP = 1, // SDP Information
    ICE = 2, // ICE Information
    BYE = 3 // Peer Disconnected
}