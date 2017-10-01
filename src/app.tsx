import { CoordinationService } from "./services/coordinationService";
import { PeerService } from "./services/peerService";
import { ServerMessage } from "./models/serverMessage";
import { PeerMessage } from "./models/peerMessage";

import {ChatWindow} from "./components/chatwindow";
import {ChatFeed} from "./components/chatfeed";

import * as React from "react";

interface IAppState {messages: PeerMessage[]}

export class App extends React.Component<undefined, IAppState> {
    private coordinationService: CoordinationService;
    private peerService: PeerService;

    constructor(props: any) {
        super(props);

        this.coordinationService = new CoordinationService();
        this.coordinationService.eventOnMessage = this.gotMessageFromServer.bind(this);
    
        this.peerService = new PeerService();
        this.peerService.eventOnPeerDescription = this.handleDescription.bind(this);
        this.peerService.eventOnPeerIceCandidate = this.handleIceCandidate.bind(this);
        this.peerService.eventOnPeerMessage = this.handleMessageFromPeer.bind(this);

        this.state = {
            messages: []
        };
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

    private handleMessageFromPeer(message: PeerMessage) {
        this.setState({
            messages: [].concat(this.state.messages, message)
        });
    }

    private handleChatWindowMessageToSend(message: string) {
        let ownMessage = new PeerMessage;
         ownMessage.body = message;
         ownMessage.source = this.coordinationService.localUuid;

         this.setState({
            messages: [].concat(this.state.messages, ownMessage)
        });

        this.peerService.messageAll(message);
    } 

    render() {
        return <div>
            <div className="topBar"><h1>Peer To Peer Chat</h1></div>
            <ChatFeed messages={this.state.messages}/>
            <ChatWindow onMessageSend={this.handleChatWindowMessageToSend.bind(this)}/>
        </div>;
    }
}