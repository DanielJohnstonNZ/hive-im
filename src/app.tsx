import {ChatWindowContainer, ChatFeedContainer, PeerWindowContainer} from "./containers";
import {SupportCheck} from "./components"

import * as React from "react";

export class App extends React.Component<undefined, undefined> {
    render() {
        return <SupportCheck>
            <div id="topbar-container"><h1>Swarmr</h1></div>
            <PeerWindowContainer/>
            <ChatFeedContainer/>
            <ChatWindowContainer/>
        </SupportCheck>;
    }
}