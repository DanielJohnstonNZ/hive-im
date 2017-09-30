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
var coordinationService_1 = __webpack_require__(2);
var peerService_1 = __webpack_require__(4);
var receiveChannel;
var coordinationService;
var peerService;
function pageReady() {
    coordinationService = new coordinationService_1.CoordinationService();
    coordinationService.eventOnMessage = gotMessageFromServer;
    peerService = new peerService_1.PeerService();
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
function gotMessageFromServer(message) {
    peerService.getById(message.source)
        .processServerMessage(message);
}
function handleIceCandidate(details, uuid) {
    coordinationService.sendIceMessage(details, uuid);
}
function handleDescription(details, uuid) {
    coordinationService.sendSdpMessage(details, uuid);
}
window.onload = pageReady;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var serverMessage_1 = __webpack_require__(0);
var uuid_1 = __webpack_require__(3);
var CoordinationService = /** @class */ (function () {
    function CoordinationService() {
        var _this = this;
        this.queuedMessages = [];
        this.localUuid = uuid_1.Uuid();
        var HOST = location.origin.replace(/^http/, 'ws');
        this.connection = new WebSocket(HOST);
        this.connection.onmessage = function (msg) { _this.handleOnMessage(msg); };
        this.connection.onopen = function () { return _this.handleOnOpen(); };
    }
    CoordinationService.prototype.sendSdpMessage = function (body, destination) {
        var sdpMessage = new serverMessage_1.ServerMessage();
        sdpMessage.source = this.localUuid;
        sdpMessage.destination = destination;
        sdpMessage.body = body;
        sdpMessage.type = serverMessage_1.ServerMessageType.SDP;
        this.sendMessage(sdpMessage);
    };
    CoordinationService.prototype.sendIceMessage = function (body, destination) {
        var iceMessage = new serverMessage_1.ServerMessage();
        iceMessage.source = this.localUuid;
        iceMessage.destination = destination;
        iceMessage.body = body;
        iceMessage.type = serverMessage_1.ServerMessageType.ICE;
        this.sendMessage(iceMessage);
    };
    CoordinationService.prototype.sendMessage = function (message) {
        if (this.connection.readyState != WebSocket.OPEN) {
            console.error("Unable to send because WebSocket isn't open");
            return;
        }
        this.connection.send(JSON.stringify(message));
    };
    CoordinationService.prototype.handleOnOpen = function () {
        var helloMessage = new serverMessage_1.ServerMessage();
        helloMessage.source = this.localUuid;
        helloMessage.type = serverMessage_1.ServerMessageType.HI;
        this.sendMessage(helloMessage);
    };
    CoordinationService.prototype.handleOnMessage = function (message) {
        var signal = JSON.parse(message.data);
        this.eventOnMessage(signal);
    };
    return CoordinationService;
}());
exports.CoordinationService = CoordinationService;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function Uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
exports.Uuid = Uuid;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var peerConnection_1 = __webpack_require__(5);
var PeerService = /** @class */ (function () {
    function PeerService() {
        this.activePeers = [];
    }
    PeerService.prototype.getById = function (id) {
        var _this = this;
        if (!this.activePeers[id]) {
            var pc = new peerConnection_1.PeerConnection(id);
            pc.eventIceCandidate = function (candidate) { _this.eventOnPeerIceCandidate(candidate, id); };
            pc.eventDescription = function (description) { return _this.eventOnPeerDescription(description, id); };
            pc.eventOnMessage = function (message) { console.log(id + " says " + message.data); };
            pc.eventOnClose = function () { return _this.handleOnClose(id); };
            this.activePeers[id] = pc;
            this.eventOnPeersChanged();
        }
        return this.activePeers[id];
    };
    PeerService.prototype.getCount = function () {
        return Object.keys(this.activePeers).length;
    };
    PeerService.prototype.messageAll = function (message) {
        for (var i in this.activePeers) {
            this.activePeers[i].messagePeer(message);
        }
    };
    PeerService.prototype.handleOnClose = function (id) {
        delete this.activePeers[id];
        this.eventOnPeersChanged();
    };
    return PeerService;
}());
exports.PeerService = PeerService;


/***/ }),
/* 5 */
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
        this.rtcConnection.onicecandidate = function (event) { _this.handleOnIceCandidate(event); };
        this.rtcConnection.oniceconnectionstatechange = function (event) { _this.handleOnIceConnectionStateChange(event); };
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
        if (event.candidate != null) {
            this.eventIceCandidate(event.candidate);
        }
    };
    PeerConnection.prototype.handleOnIceConnectionStateChange = function (event) {
        if (this.rtcConnection.iceConnectionState === 'disconnected') {
            this.eventOnClose();
        }
    };
    PeerConnection.prototype.handleOnDataChannel = function (event) {
        var _this = this;
        this.rtcReceiveChannel = event.channel;
        this.rtcReceiveChannel.onmessage = function (event) { _this.handleReceiveChannelOnMessage(event); };
        this.rtcReceiveChannel.onopen = function () { _this.handleReceiveChannelOnOpen(); };
        this.rtcReceiveChannel.onclose = function () { _this.handleReceiveChannelOnClose(); };
    };
    PeerConnection.prototype.handleReceiveChannelOnMessage = function (event) {
        this.eventOnMessage(event);
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