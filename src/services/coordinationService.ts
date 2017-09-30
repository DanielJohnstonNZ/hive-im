import {ServerMessage, ServerMessageType} from "../models/serverMessage";
import { Uuid } from "../helpers/uuid";

export class CoordinationService {
    private localUuid: string;
    private connection : WebSocket;
    private queuedMessages: object[];

    public eventOnMessage: (message: ServerMessage) => void;

    constructor() {
        this.queuedMessages = [];
        this.localUuid = Uuid();

        var HOST = location.origin.replace(/^http/, 'ws')
        this.connection = new WebSocket(HOST);
    
        this.connection.onmessage = (msg) => { this.handleOnMessage(msg) };
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
    private handleOnMessage(message: MessageEvent) {
        var signal : ServerMessage = JSON.parse(message.data);

        this.eventOnMessage(signal);
    }
}