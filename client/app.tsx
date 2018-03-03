import {ChatFeed, PeerWindow} from "./components";
import {SupportCheck} from "./components"

import * as React from "react";

export class App extends React.Component<undefined, undefined> {
    render() {
        return <SupportCheck>
            <PeerWindow/>
            <ChatFeed/>
        </SupportCheck>;
    }
}