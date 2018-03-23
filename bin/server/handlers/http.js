"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const debug = require("debug");
class HttpHandler {
    constructor() {
        this.port = process.env.PORT || '8080';
        this.root = 'webroot';
        this.logger = debug('http');
        let middleWare = express();
        middleWare.use((req, res, next) => {
            this.logger(req.url);
            next();
        });
        middleWare.use(express.static(this.root));
        this.server = http.createServer(middleWare);
        this.server.listen(this.port, () => this.logger(`Listening on ${this.port}`));
    }
    getServer() {
        return this.server;
    }
}
exports.HttpHandler = HttpHandler;
