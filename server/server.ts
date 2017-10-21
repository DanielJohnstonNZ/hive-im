import {HttpHandler} from './handlers/http';
import {PeerHandler} from './handlers/peer';

let http : HttpHandler = new HttpHandler();
let peer: PeerHandler = new PeerHandler(http.getServer());