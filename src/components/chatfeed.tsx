import * as React from "react";

import {PeerMessage} from "../models/peerMessage";

const chatFeedStyle : object = {
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    bottom: "15%",
    borderTop: "1px solid #AAA",
    padding: "30px"
}

interface IChatFeedProps { messages: PeerMessage[] }

export class ChatFeed extends React.Component<IChatFeedProps, undefined> {
    render() {
        return <div style={chatFeedStyle}>
            {this.props.messages.map(function(message: PeerMessage, index: number) {
                return <span key={index}>[{message.source}] - {message.body}<br /></span>
            })}
        </div>
    }
}