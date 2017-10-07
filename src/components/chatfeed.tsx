import * as React from "react";

import {PeerMessage} from "../models";

interface IChatFeedProps { messages: PeerMessage[] }

export class ChatFeed extends React.Component<IChatFeedProps, undefined> {
    render() {
        return <div id="feed-container">
                {this.props.messages.map(function(message: PeerMessage, index: number) {
                    return <div key={index}><div className="chat">
                        <div className="chat-body">{message.body}</div>
                        <div className="chat-user">{message.source}</div>
                        <div className="chat-time">{message.timestamp.toLocaleTimeString()}</div>
                    </div></div>
                })}
        </div>
    }
}