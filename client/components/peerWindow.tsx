import * as React from "react";
import { Peer } from "../redux";
import { PeerDisplay } from ".";
import { IRootState } from "../redux";
//import { PeerListStreamInput } from "../streams/peers";

const peerContainerStyle: object = {
  backgroundColor: "#E5E5E5",
  float: "left",
  width: "80vw",
  height: "100vh",
  color: "white"
};

interface IPeerWindowProps {}
interface IPeerWindowState {
  peers: Peer[];
}

export class PeerWindowComponent extends React.PureComponent<
  IPeerWindowProps,
  IPeerWindowState
> {
  constructor() {
    super();

    this.state = {
      peers: []
    };
  }

  componentDidMount() {
    let t = this;

    // PeerListStreamInput.subscribe({
    //   next: (peer: Peer) => t.setState({ peers: this.state.peers.concat(peer) })
    // });
  }

  render() {
    return (
      <div style={peerContainerStyle} className="background">
        <h1
          style={{
            textAlign: "center",
            color: "#EB0000",
            margin: 0,
            padding: 0
          }}
        >
          Swarmr
        </h1>

        <PeerDisplay peer={null} />

        {this.state.peers.map(function(peer: Peer, index: number) {
          return <PeerDisplay key={index} peer={peer} />;
        })}
      </div>
    );
  }
}
