import {Subject,Observable} from "rxjs"
import {MetaData} from "../models";
import {PeerFactory} from "../middleware/peerFactory"


let connection: WebSocket = new WebSocket(location.origin.replace(/^http/, 'ws'));

export const ServerStreamOutput = new Subject<MetaData>();
connection.onmessage = (event: MessageEvent) => { 
    let message: MetaData = JSON.parse(event.data);

    ServerStreamOutput.next(message);
}

export const ServerStreamInput = new Subject<MetaData>();
ServerStreamInput.subscribe({
    next: (message) => connection.send(JSON.stringify(message))
})




