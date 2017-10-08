import * as React from "react";

import {Peer} from "../models";

export interface ITopBarProps { localInfo: Peer }

export class TopBar extends React.PureComponent<ITopBarProps, undefined> {
    render() {
        return <div id="topbar-container">
            <h1>Swarmr</h1>
            <span className="display-name">
                <span className="connected">&bull;</span> 
                {this.props.localInfo ? this.props.localInfo.displayName : ""}
            </span>
        </div>
    }
}