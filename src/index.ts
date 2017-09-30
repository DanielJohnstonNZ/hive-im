import { CoordinationService } from "./services/coordinationService";
import { PeerService } from "./services/peerService";
import { ServerMessage } from "./models/serverMessage";

var receiveChannel;

var coordinationService: CoordinationService;
var peerService: PeerService;

function pageReady() {
    coordinationService = new CoordinationService();
    coordinationService.eventOnMessage = gotMessageFromServer;

    peerService = new PeerService();
    peerService.eventOnPeerDescription = handleDescription;
    peerService.eventOnPeerIceCandidate = handleIceCandidate;
    peerService.eventOnPeersChanged = handleOnPeersChange;

    setTimeout(polling, 1000);

    handleOnPeersChange();
}

function polling() {
    peerService.messageAll("Ping");

    setTimeout(polling, 1000);
}

function handleOnPeersChange() {
    document.body.innerHTML = "Number of Peers: " + peerService.getCount();
}

function gotMessageFromServer(message: ServerMessage) {
    peerService.getById(message.source)
        .processServerMessage(message);
}

function handleIceCandidate(details: RTCIceCandidate, uuid: string) {
    coordinationService.sendIceMessage(details, uuid);
}

function handleDescription(details: RTCSessionDescription, uuid: string) {
    coordinationService.sendSdpMessage(details, uuid);
}

window.onload = pageReady;