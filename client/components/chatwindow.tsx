import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { IRootState } from "../redux";
import * as peerActions from "../redux/peer";

const chatContainerStyle: object = {
  height: 40,
  border: "none",
  borderTop: "1px solid #555"
};

const chatContainerInputStyle: object = {
  width: "100%",
  fontSize: "1em",
  lineHeight: "1em",
  border: "none",
  height: "100%",
  outline: "none",
  paddingRight: "45px"
};

const chatSendIconStyle: object = {
  margin: 0,
  display: "block",
  float: "left",
  cursor: "pointer",
  width: 36,
  height: 36,
  backgroundSize: "36px 36px",
  marginTop: 2,
  backgroundImage:
    "url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDUzNS41IDUzNS41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MzUuNSA1MzUuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJzZW5kIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNDk3LjI1IDUzNS41LDI2Ny43NSAwLDM4LjI1IDAsMjE2Ljc1IDM4Mi41LDI2Ny43NSAwLDMxOC43NSAgICIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)"
};

interface IChatWindowState {
  message: string;
}
interface IChatWindowProps {
  onSend: (message: string) => void;
}

export class ChatWindow extends React.Component<
  IChatWindowProps,
  IChatWindowState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      message: ""
    };
  }

  render() {
    return (
      <div style={chatContainerStyle}>
        <div
          style={{ float: "left", width: "calc(100% - 36px)", height: "100%" }}
        >
          <input
            type="text"
            style={chatContainerInputStyle}
            placeholder="Type a message."
            value={this.state.message}
            onKeyDown={this.handleMessageOnKeydown.bind(this)}
            onChange={this.handleMessageOnChange.bind(this)}
          />
        </div>
        <div style={chatSendIconStyle} onClick={this.handleOnSend.bind(this)} />
      </div>
    );
  }

  private handleOnSend() {
    this.props.onSend(this.state.message);
    this.setState({ message: "" });
  }

  private handleMessageOnChange(event: any) {
    this.setState({ message: event.target.value });
  }

  private handleMessageOnKeydown(event: any) {
    // If Enter was pressed, treat this as a send.
    if (event.keyCode == 13) {
      event.preventDefault();
      this.handleOnSend();
    }
  }
}

const mapStateToProps = (state: IRootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  onSend: (message: string) => dispatch(peerActions.sendMessage(message))
});

export const ChatWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatWindow);
