import {ServerMessage, ServerMessageType} from "../models/serverMessage";

export class Server {
    private localUuid: string;
    private connection : WebSocket;
    private queuedMessages: object[];
    constructor(uuid: string, onMessage: Function) {
        this.queuedMessages = [];
        this.localUuid = uuid;

        this.connection = new WebSocket('ws://localhost:3434');
        this.connection.onmessage = (msg) => { onMessage(msg) };
        this.connection.onopen = () => this.handleOnOpen();
    }
    sendSdpMessage(body: any, destination: string) {
        let sdpMessage = new ServerMessage()
        sdpMessage.source = this.localUuid;
        sdpMessage.destination = destination;
        sdpMessage.body = body;
        sdpMessage.type = ServerMessageType.SDP;

        this.sendMessage(sdpMessage);
    }
    sendIceMessage(body: any, destination: string) {
        let iceMessage = new ServerMessage()
        iceMessage.source = this.localUuid;
        iceMessage.destination = destination;
        iceMessage.body = body;
        iceMessage.type = ServerMessageType.ICE;

        this.sendMessage(iceMessage);
    }
    private sendMessage(message: ServerMessage) {
        if (this.connection.readyState != WebSocket.OPEN) {
            console.error("Unable to send because WebSocket isn't open");
            return;
        }

        this.connection.send(JSON.stringify(message));
    }
    private handleOnOpen() {
        let helloMessage = new ServerMessage()
        helloMessage.source = this.localUuid;
        helloMessage.type = ServerMessageType.HI

        this.sendMessage(helloMessage);
    }
}