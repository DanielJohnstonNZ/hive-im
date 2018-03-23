"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./handlers/http");
const peer_1 = require("./handlers/peer");
let http = new http_1.HttpHandler();
let peer = new peer_1.PeerHandler(http.getServer());
