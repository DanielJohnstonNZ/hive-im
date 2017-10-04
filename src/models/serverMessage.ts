export class ServerMessage{
    public source: string;
    public destination: string;
    public type: ServerMessageType;
    public body: any;
    public isProcessed: boolean;
}

export enum ServerMessageType{
    HI = 0,
    SDP = 1,
    ICE = 2
}