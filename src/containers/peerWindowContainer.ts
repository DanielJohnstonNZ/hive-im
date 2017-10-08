import { connect } from "react-redux"
import { PeerWindow } from "../components"
import { State } from "../models"

const mapStateToProps = (state: State, ownProps: any) => {
  return {
      peers: state.peers
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
  }
}

export const PeerWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerWindow)