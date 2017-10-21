import { connect } from "react-redux"
import { TopBar, ITopBarProps } from "../components"
import { State } from "../models"

const mapStateToProps = (state: State, ownProps: ITopBarProps) => {
  return {
      localInfo: state.local
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
  }
}

export const TopBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar)