import * as React from "react";
import {Peer} from "../models";
import {PeerDisplay} from ".";
import { connect } from "react-redux"
import { State } from "../models"

const peerContainerStyle: object = {
    backgroundColor: "#E5E5E5",
    float: "left",
    width: "80vw",
    height: "100vh",
    color: "white"
}

interface IPeerWindowProps { peers: Peer[], local: Peer }

class PeerWindowComponent extends React.PureComponent<IPeerWindowProps, undefined> {
    render() {
        return <div style={peerContainerStyle} className="background">
            <h1 style={{textAlign: "center", color: "#EB0000", margin: 0, padding: 0}}>Swarmr</h1>

            <PeerDisplay peer={this.props.local}/>

            {this.props.peers.map(function(peer: Peer, index: number) {
                return <PeerDisplay key={index} peer={peer}/>
            })}
        </div>
    }
}

const mapStateToProps = (state: State, ownProps: any) => {
  return {
      peers: state.peers,
      local: state.local
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
  }
}

export const PeerWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerWindowComponent)