import { CoordinationService } from "./services/coordinationService";
import { PeerService } from "./services/peerService";
import { ServerMessage } from "./models/serverMessage";

import * as React from "react";


export class App extends React.Component<undefined, undefined> {
    private coordinationService: CoordinationService;
    private peerService: PeerService;

    constructor(props: any) {
        super(props);

        this.coordinationService = new CoordinationService();
        this.coordinationService.eventOnMessage = this.gotMessageFromServer.bind(this);
    
        this.peerService = new PeerService();
        this.peerService.eventOnPeerDescription = this.handleDescription.bind(this);
        this.peerService.eventOnPeerIceCandidate = this.handleIceCandidate.bind(this);
        this.peerService.eventOnPeersChanged = () =>  {};

        
        setTimeout(this.polling.bind(this), 1000);
    }

    private polling() {
        this.peerService.messageAll("Ping");

        setTimeout(this.polling.bind(this), 1000);
    }

    private gotMessageFromServer(message: ServerMessage) {
        this.peerService.getById(message.source)
            .processServerMessage(message);
    }
    
    private handleIceCandidate(details: RTCIceCandidate, uuid: string) {
        this.coordinationService.sendIceMessage(details, uuid);
    }
    
    private handleDescription(details: RTCSessionDescription, uuid: string) {
        this.coordinationService.sendSdpMessage(details, uuid);
    }

    private handlePeersChange() {
        console.log(this);
    }

    render() {
        return <h1>Welcome</h1>;
    }
}