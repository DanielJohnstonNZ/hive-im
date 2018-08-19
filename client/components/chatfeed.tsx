import * as React from "react";
import { Message } from "../redux";
import { ChatWindowComponent } from ".";

interface IChatFeedProps {}
interface IChatFeedState {}

const feedContainerStyle: object = {
  float: "left",
  width: "20vw",
  height: "100vh",
  overflowY: "auto"
};

const feedStyle: object = {
  height: "calc(100% - 40px)"
};

const chatContainerStyle: object = {
  display: "inline-block",
  width: "auto",
  padding: 10,
  margin: 5,
  borderRadius: 4,
  fontSize: "1em",
  border: "1px solid #999",
  background: "#ccc"
};

const chatTimeStyle: object = {
  fontSize: "0.7em",
  color: "#444",
  display: "inline-block",
  paddingLeft: 10
};

const chatUserStyle: object = {
  fontSize: "0.8em",
  color: "#444",
  display: "inline-block"
};

export class ChatFeedComponent extends React.Component<
  IChatFeedProps,
  undefined
> {
  render() {
    return (
      <div style={feedContainerStyle}>
        <div style={feedStyle}>
          {[].map(function(message: Message, index: number) {
            return (
              <div key={index}>
                <div style={chatContainerStyle}>
                  <div>{message.body}</div>
                  <div style={chatUserStyle}>{message.source.displayName}</div>
                  <div style={chatTimeStyle}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ChatWindowComponent />
      </div>
    );
  }
}
