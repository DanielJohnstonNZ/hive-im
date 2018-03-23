"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
}
exports.Message = Message;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["HI"] = 0] = "HI";
    MessageType[MessageType["SDP"] = 1] = "SDP";
    MessageType[MessageType["ICE"] = 2] = "ICE";
    MessageType[MessageType["BYE"] = 3] = "BYE";
    MessageType[MessageType["TEXT"] = 4] = "TEXT";
    MessageType[MessageType["INFO"] = 5] = "INFO"; // Info Message
})(MessageType = exports.MessageType || (exports.MessageType = {}));
