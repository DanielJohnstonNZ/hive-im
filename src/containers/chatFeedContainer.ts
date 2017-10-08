import {connect} from "react-redux"
import {ChatFeed} from "../components"
import { State } from "../models"

const mapStateToProps = (state: State, ownProps: any) => {
    return {
        messages: state.messages
    }
  }
  
  const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return {
    }
  }

  export const ChatFeedContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChatFeed)

  