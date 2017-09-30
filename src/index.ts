import { Server } from "./helpers/server";
import { ServerMessage, ServerMessageType } from "./models/serverMessage";
import { PeerConnection } from "./models/peerConnection";

var peers: PeerConnection[] = [];

var receiveChannel;
var localuuid;
var serverConnection: Server;


function pageReady() {
    localuuid = uuid();

    serverConnection = new Server(localuuid, gotMessageFromServer);
}

function gotMessageFromServer(message) {
    var signal : ServerMessage = JSON.parse(message.data);

    let peerConnection = getPeerConnection(signal.source);

    peerConnection.processServerMessage(signal);
}

function getPeerConnection(extUuid) {
    if (!peers[extUuid]) {
        let pc: PeerConnection = new PeerConnection(extUuid);
        
        pc.eventIceCandidate = function(event) {
            if (event.candidate != null) {
                serverConnection.sendIceMessage(event.candidate, this.uuid);
            }
        };

        pc.eventDescription= function(details) {
            createdDescription(details, this.uuid);
        } 
        
        peers[extUuid] = pc;
    }

    return peers[extUuid];
}

function createdDescription(description, extUuid) {
    serverConnection.sendSdpMessage(description, extUuid);
}

function message() {
    for(var i in peers) {
        peers[i].messagePeer("hello from the othertab");
    }

    setTimeout(message, 1000);
}

setTimeout(message, 1000);

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

pageReady();