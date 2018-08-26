import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({path: path.resolve(__dirname, "../.env")});

import { HttpHandler } from "./http/HttpHandler";
import { PeerHandler } from "./websocket/PeerHandler";

let http: HttpHandler = new HttpHandler();
let peer: PeerHandler = new PeerHandler(http.getServer());
