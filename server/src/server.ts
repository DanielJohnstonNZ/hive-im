import { HttpHandler } from "./http/HttpHandler";
import { PeerHandler } from "./websocket/PeerHandler";

let http: HttpHandler = new HttpHandler();
let peer: PeerHandler = new PeerHandler(http.getServer());
