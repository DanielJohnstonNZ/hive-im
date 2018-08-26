import { ChatFeedComponent, PeerWindowContainer } from "./components";

import * as React from "react";
import { store } from ".";
import { appLoad } from "./redux/app/actions";

export class App extends React.Component<undefined, undefined> {
  componentDidMount() {
    store.dispatch(appLoad());
  }
  render() {
    return (
      <div>
        <PeerWindowContainer />
        <ChatFeedComponent />
      </div>
    );
  }
}
