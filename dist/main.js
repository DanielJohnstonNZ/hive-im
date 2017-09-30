/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var ServerMessage = /** @class */ (function () {
    function ServerMessage() {
    }
    return ServerMessage;
}());
exports.ServerMessage = ServerMessage;
var ServerMessageType;
(function (ServerMessageType) {
    ServerMessageType[ServerMessageType["HI"] = 0] = "HI";
    ServerMessageType[ServerMessageType["SDP"] = 1] = "SDP";
    ServerMessageType[ServerMessageType["ICE"] = 2] = "ICE";
})(ServerMessageType = exports.ServerMessageType || (exports.ServerMessageType = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var server_1 = __webpack_require__(2);
var peerConnection_1 = __webpack_require__(3);
var peers = [];
var receiveChannel;
var localuuid;
var serverConnection;
function pageReady() {
    localuuid = uuid();
    serverConnection = new server_1.Server(localuuid, gotMessageFromServer);
}
function gotMessageFromServer(message) {
    var signal = JSON.parse(message.data);
    var peerConnection = getPeerConnection(signal.source);
    peerConnection.processServerMessage(signal);
}
function getPeerConnection(extUuid) {
    if (!peers[extUuid]) {
        var pc = new peerConnection_1.PeerConnection(extUuid);
        pc.eventIceCandidate = function (event) {
            if (event.candidate != null) {
                serverConnection.sendIceMessage(event.candidate, this.uuid);
            }
        };
        pc.eventDescription = function (details) {
            createdDescription(details, this.uuid);
        };
        peers[extUuid] = pc;
    }
    return peers[extUuid];
}
function createdDescription(description, extUuid) {
    serverConnection.sendSdpMessage(description, extUuid);
}
function message() {
    for (var i in peers) {
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var serverMessage_1 = __webpack_require__(0);
var Server = /** @class */ (function () {
    function Server(uuid, onMessage) {
        var _this = this;
        this.queuedMessages = [];
        this.localUuid = uuid;
        var HOST = location.origin.replace(/^http/, 'ws');
        this.connection = new WebSocket(HOST);
        this.connection.onmessage = function (msg) { onMessage(msg); };
        this.connection.onopen = function () { return _this.handleOnOpen(); };
    }
    Server.prototype.sendSdpMessage = function (body, destination) {
        var sdpMessage = new serverMessage_1.ServerMessage();
        sdpMessage.source = this.localUuid;
        sdpMessage.destination = destination;
        sdpMessage.body = body;
        sdpMessage.type = serverMessage_1.ServerMessageType.SDP;
        this.sendMessage(sdpMessage);
    };
    Server.prototype.sendIceMessage = function (body, destination) {
        var iceMessage = new serverMessage_1.ServerMessage();
        iceMessage.source = this.localUuid;
        iceMessage.destination = destination;
        iceMessage.body = body;
        iceMessage.type = serverMessage_1.ServerMessageType.ICE;
        this.sendMessage(iceMessage);
    };
    Server.prototype.sendMessage = function (message) {
        if (this.connection.readyState != WebSocket.OPEN) {
            console.error("Unable to send because WebSocket isn't open");
            return;
        }
        this.connection.send(JSON.stringify(message));
    };
    Server.prototype.handleOnOpen = function () {
        var helloMessage = new serverMessage_1.ServerMessage();
        helloMessage.source = this.localUuid;
        helloMessage.type = serverMessage_1.ServerMessageType.HI;
        this.sendMessage(helloMessage);
    };
    return Server;
}());
exports.Server = Server;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var serverMessage_1 = __webpack_require__(0);
var peerConnectionConfig = {
    'iceServers': [
        { 'urls': 'stun:stun.services.mozilla.com' },
        { 'urls': 'stun:stun.l.google.com:19302' },
    ]
};
var PeerConnection = /** @class */ (function () {
    function PeerConnection(uuid) {
        var _this = this;
        this.uuid = uuid;
        this.rtcConnection = new RTCPeerConnection(peerConnectionConfig);
        this.rtcConnection.ondatachannel = function (event) { _this.handleOnDataChannel(event); };
        this.rtcConnection.onicecandidate = function (event) { _this.eventIceCandidate(event); };
        this.rtcSendChannel = this.rtcConnection.createDataChannel('sendDataChannel', null);
    }
    PeerConnection.prototype.processServerMessage = function (signal) {
        switch (signal.type) {
            case serverMessage_1.ServerMessageType.HI:
                this.createOffer();
                break;
            case serverMessage_1.ServerMessageType.ICE:
                this.addIceCandidate(signal.body);
                break;
            case serverMessage_1.ServerMessageType.SDP:
                this.setRemoteDescription(signal.body);
                break;
        }
    };
    PeerConnection.prototype.createOffer = function () {
        var peer = this;
        this.rtcConnection
            .createOffer()
            .then(function (description) {
            peer.setLocalDescription(description);
        })["catch"](this.handleError);
    };
    PeerConnection.prototype.setRemoteDescription = function (details) {
        var peer = this;
        this.rtcConnection
            .setRemoteDescription(new RTCSessionDescription(details))
            .then(function () {
            // Only create answers in response to offers
            if (details.type == 'offer') {
                peer.rtcConnection
                    .createAnswer()
                    .then(function (description) {
                    peer.setLocalDescription(description);
                })["catch"](peer.handleError);
            }
        })["catch"](this.handleError);
    };
    PeerConnection.prototype.setLocalDescription = function (details) {
        var peer = this;
        this.rtcConnection
            .setLocalDescription(details)
            .then(function () {
            peer.eventDescription(peer.rtcConnection.localDescription);
        })["catch"](this.handleError);
    };
    PeerConnection.prototype.addIceCandidate = function (details) {
        this.rtcConnection
            .addIceCandidate(new RTCIceCandidate(details))["catch"](this.handleError);
    };
    PeerConnection.prototype.handleOnIceCandidate = function (event) {
        this.eventIceCandidate(event, this.uuid);
    };
    PeerConnection.prototype.handleOnDataChannel = function (event) {
        var _this = this;
        this.rtcReceiveChannel = event.channel;
        this.rtcReceiveChannel.onmessage = function (event) { _this.handleReceiveChannelOnMessage(event); };
        this.rtcReceiveChannel.onopen = function () { _this.handleReceiveChannelOnOpen(); };
        this.rtcReceiveChannel.onclose = function () { _this.handleReceiveChannelOnClose(); };
    };
    PeerConnection.prototype.handleReceiveChannelOnMessage = function (event) {
        console.log('Received Message');
        console.log(event);
    };
    PeerConnection.prototype.handleReceiveChannelOnOpen = function () {
        var readyState = this.rtcReceiveChannel.readyState;
    };
    PeerConnection.prototype.handleReceiveChannelOnClose = function () {
        var readyState = this.rtcSendChannel.readyState;
    };
    PeerConnection.prototype.handleError = function () {
    };
    PeerConnection.prototype.messagePeer = function (message) {
        if (this.rtcSendChannel.readyState == 'open') {
            this.rtcSendChannel.send(message);
        }
    };
    return PeerConnection;
}());
exports.PeerConnection = PeerConnection;


/***/ })
/******/ ]);