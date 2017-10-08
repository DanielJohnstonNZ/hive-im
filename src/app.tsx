import {ChatWindowContainer, ChatFeedContainer, PeerWindowContainer, TopBarContainer} from "./containers";
import {SupportCheck} from "./components"

import * as React from "react";

export class App extends React.Component<undefined, undefined> {
    render() {
        return <SupportCheck>
            <TopBarContainer/>
            <PeerWindowContainer/>
            <ChatFeedContainer/>
            <ChatWindowContainer/>
        </SupportCheck>;
    }
}