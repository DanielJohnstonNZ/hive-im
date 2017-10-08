import * as React from "react";

import {Peer} from "../models";

interface IPeerWindowProps { peers: Peer[] }

export class PeerWindow extends React.PureComponent<IPeerWindowProps, undefined> {
    render() {
        return <div id="peers-container">
            <div className="peers-title">Other Users</div>
            {this.props.peers.map(function(peer: Peer, index: number) {
                return <div key={index}>
                    <div className="peer">
                        <span className="connected">&bull;</span> 
                        {peer.displayName}
                    </div>
                </div>
            })}
        </div>
    }
}