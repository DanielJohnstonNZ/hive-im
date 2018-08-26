import * as React from "react";
// import { Peer } from "../redux";
import { PeerDisplay } from ".";
import { IRootState } from "../redux";
//import { PeerListStreamInput } from "../streams/peers";

import { connect } from "react-redux";

const peerContainerStyle: object = {
  backgroundColor: "#E5E5E5",
  float: "left",
  width: "80vw",
  height: "100vh",
  color: "white"
};

interface IPeerWindowProps {
  peers: any[];
}

class PeerWindow extends React.PureComponent<IPeerWindowProps, {}> {
  constructor() {
    super();

    // this.state = {
    //   peers: []
    // };
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

        {this.props.peers &&
          this.props.peers.map(function(peer: any, index: number) {
            return <PeerDisplay key={index} peer={peer} />;
          })}
      </div>
    );
  }
}

const mapStateToProps = (state: IRootState) => {
  return {
    peers: state.peer.peers
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export const PeerWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerWindow);
