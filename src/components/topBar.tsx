import * as React from "react";
import {Peer} from "../models";
import {PeerDisplay}  from ".";

const topBarContainerStyle: object = {
    position: "absolute",
    top: 0,
    right: 0,
    left: "20%",
    height: 40,
    borderBottom: "1px solid #999"
}

const topBarDisplayNameStyle: object = {
    float: "right",
    paddingRight: 20
}

const topBarHeaderStyle: object = {
    fontSize: 30,
    lineHeight: "30px",
    margin: 0,
    padding: 0,
    paddingTop: 5,
    paddingLeft: 20,
    display: "inline-block"
}

export interface ITopBarProps { localInfo: Peer }

export class TopBar extends React.PureComponent<ITopBarProps, undefined> {
    render() {
        return <div style={topBarContainerStyle}>
            <h1 style={topBarHeaderStyle}>Swarmr</h1>
            <span style={topBarDisplayNameStyle}>
                <PeerDisplay peer={this.props.localInfo} />
            </span>
        </div>
    }
}