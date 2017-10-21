import * as React from "react";

import {Peer} from "../models";
import {PeerDisplay} from ".";

const peerContainerStyle: object = {
    backgroundColor: "#555",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "20%",
    paddingTop: 40,
    color: "white"
}

const peerTitleStyle: object = {
    textAlign: "center",
    marginBottom: 30
}


interface IPeerWindowProps { peers: Peer[] }

export class PeerWindow extends React.PureComponent<IPeerWindowProps, undefined> {
    render() {
        return <div style={peerContainerStyle}>
            <div style={peerTitleStyle}>Other Users</div>
            {this.props.peers.map(function(peer: Peer, index: number) {
                return <div key={index}>
                    <PeerDisplay peer={peer}/>
                </div>
            })}
        </div>
    }
}