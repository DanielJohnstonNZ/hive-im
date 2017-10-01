webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var ServerMessage = /** @class */function () {
    function ServerMessage() {}
    return ServerMessage;
}();
exports.ServerMessage = ServerMessage;
var ServerMessageType;
(function (ServerMessageType) {
    ServerMessageType[ServerMessageType["HI"] = 0] = "HI";
    ServerMessageType[ServerMessageType["SDP"] = 1] = "SDP";
    ServerMessageType[ServerMessageType["ICE"] = 2] = "ICE";
})(ServerMessageType = exports.ServerMessageType || (exports.ServerMessageType = {}));

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __webpack_require__(18);
var React = __webpack_require__(3);
var ReactDOM = __webpack_require__(11);
ReactDOM.render(React.createElement(app_1.App, null), document.getElementById("app"));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var coordinationService_1 = __webpack_require__(19);
var peerService_1 = __webpack_require__(21);
var React = __webpack_require__(3);
var App = /** @class */function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.coordinationService = new coordinationService_1.CoordinationService();
        _this.coordinationService.eventOnMessage = _this.gotMessageFromServer.bind(_this);
        _this.peerService = new peerService_1.PeerService();
        _this.peerService.eventOnPeerDescription = _this.handleDescription.bind(_this);
        _this.peerService.eventOnPeerIceCandidate = _this.handleIceCandidate.bind(_this);
        _this.peerService.eventOnPeersChanged = function () {};
        setTimeout(_this.polling.bind(_this), 1000);
        return _this;
    }
    App.prototype.polling = function () {
        this.peerService.messageAll("Ping");
        setTimeout(this.polling.bind(this), 1000);
    };
    App.prototype.gotMessageFromServer = function (message) {
        this.peerService.getById(message.source).processServerMessage(message);
    };
    App.prototype.handleIceCandidate = function (details, uuid) {
        this.coordinationService.sendIceMessage(details, uuid);
    };
    App.prototype.handleDescription = function (details, uuid) {
        this.coordinationService.sendSdpMessage(details, uuid);
    };
    App.prototype.handlePeersChange = function () {
        console.log(this);
    };
    App.prototype.render = function () {
        return React.createElement("h1", null, "Welcome");
    };
    return App;
}(React.Component);
exports.App = App;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var serverMessage_1 = __webpack_require__(10);
var uuid_1 = __webpack_require__(20);
var CoordinationService = /** @class */function () {
    function CoordinationService() {
        var _this = this;
        this.queuedMessages = [];
        this.localUuid = uuid_1.Uuid();
        var HOST = location.origin.replace(/^http/, 'ws');
        this.connection = new WebSocket(HOST);
        this.connection.onmessage = function (msg) {
            _this.handleOnMessage(msg);
        };
        this.connection.onopen = function () {
            return _this.handleOnOpen();
        };
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
}();
exports.CoordinationService = CoordinationService;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var peerConnection_1 = __webpack_require__(22);
var PeerService = /** @class */function () {
    function PeerService() {
        this.activePeers = {};
    }
    PeerService.prototype.getById = function (id) {
        var _this = this;
        if (!this.activePeers[id]) {
            var pc = new peerConnection_1.PeerConnection(id);
            pc.eventIceCandidate = function (candidate) {
                _this.eventOnPeerIceCandidate(candidate, id);
            };
            pc.eventDescription = function (description) {
                return _this.eventOnPeerDescription(description, id);
            };
            pc.eventOnMessage = function (message) {
                console.log(id + " says " + message.data);
            };
            pc.eventOnClose = function () {
                return _this.handleOnClose(id);
            };
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
}();
exports.PeerService = PeerService;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var serverMessage_1 = __webpack_require__(10);
var peerConnectionConfig = {
    'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }]
};
var PeerConnection = /** @class */function () {
    function PeerConnection(uuid) {
        var _this = this;
        this.uuid = uuid;
        this.rtcConnection = new RTCPeerConnection(peerConnectionConfig);
        this.rtcConnection.ondatachannel = function (event) {
            _this.handleOnDataChannel(event);
        };
        this.rtcConnection.onicecandidate = function (event) {
            _this.handleOnIceCandidate(event);
        };
        this.rtcConnection.oniceconnectionstatechange = function (event) {
            _this.handleOnIceConnectionStateChange(event);
        };
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
        this.rtcConnection.createOffer().then(function (description) {
            peer.setLocalDescription(description);
        }).catch(this.handleError);
    };
    PeerConnection.prototype.setRemoteDescription = function (details) {
        var peer = this;
        this.rtcConnection.setRemoteDescription(new RTCSessionDescription(details)).then(function () {
            // Only create answers in response to offers
            if (details.type == 'offer') {
                peer.rtcConnection.createAnswer().then(function (description) {
                    peer.setLocalDescription(description);
                }).catch(peer.handleError);
            }
        }).catch(this.handleError);
    };
    PeerConnection.prototype.setLocalDescription = function (details) {
        var peer = this;
        this.rtcConnection.setLocalDescription(details).then(function () {
            peer.eventDescription(peer.rtcConnection.localDescription);
        }).catch(this.handleError);
    };
    PeerConnection.prototype.addIceCandidate = function (details) {
        this.rtcConnection.addIceCandidate(new RTCIceCandidate(details)).catch(this.handleError);
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
        this.rtcReceiveChannel.onmessage = function (event) {
            _this.handleReceiveChannelOnMessage(event);
        };
        this.rtcReceiveChannel.onopen = function () {
            _this.handleReceiveChannelOnOpen();
        };
        this.rtcReceiveChannel.onclose = function () {
            _this.handleReceiveChannelOnClose();
        };
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
    PeerConnection.prototype.handleError = function () {};
    PeerConnection.prototype.messagePeer = function (message) {
        if (this.rtcSendChannel.readyState == 'open') {
            this.rtcSendChannel.send(message);
        }
    };
    return PeerConnection;
}();
exports.PeerConnection = PeerConnection;

/***/ })
],[17]);
//# sourceMappingURL=main.js.map