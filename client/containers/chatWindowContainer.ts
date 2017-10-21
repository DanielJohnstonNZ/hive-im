import { connect } from "react-redux"
import { ChatWindow } from "../components"
import { State } from "../models"
import { sendTextMessage } from "../actions"

const mapStateToProps = (state: State, ownProps: any) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onMessageSend: (message: string) => dispatch(sendTextMessage(message))
  }
}

export const ChatWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatWindow)
