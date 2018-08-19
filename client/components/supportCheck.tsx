import * as React from "react";

import { WebRTCSupport } from "../helpers/webRtcSupport";

export class SupportCheck extends React.PureComponent {
  render() {
    // Since WebRTC isn't supported by all browsers. Only start the app
    // if support is detected.
    if (WebRTCSupport) {
      return <div>{this.props.children}</div>;
    }

    const supportWarningStyle: any = {
      padding: 10,
      fontSize: 25
    };

    return (
      <div style={supportWarningStyle}>Browser doesn't support WebRTC :(</div>
    );
  }
}
