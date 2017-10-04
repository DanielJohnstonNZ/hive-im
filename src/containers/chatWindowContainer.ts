import { connect } from "react-redux"
import { ChatWindow } from "../components"

import { peerSendMessage } from "../actions"

const mapStateToProps = (state: any, ownProps: any) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onMessageSend: (message: string) => dispatch(peerSendMessage(message))
  }
}

export const ChatWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatWindow)
