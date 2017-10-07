import { connect } from "react-redux"
import { PeerWindow } from "../components"

const mapStateToProps = (state: any, ownProps: any) => {
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