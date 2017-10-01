import { App } from "./app";

import * as React from "react";
import * as ReactDOM from "react-dom";

// Wrap the app in a compatibility check.
class SupportCheck extends React.PureComponent{
    render() {
        if (typeof RTCPeerConnection != 'undefined') {
            return <App/>
        }

        const supportWarningStyle: any = {
            padding: 10,
            fontSize: 25
        };

        return <div style={supportWarningStyle}>Browser doesn't support WebRTC :(</div>
    }
}

ReactDOM.render(
    <SupportCheck/>,
    document.getElementById("app")
);