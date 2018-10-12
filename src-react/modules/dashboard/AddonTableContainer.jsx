import React from 'react'
import { connect } from 'react-redux'
import { getAddonList } from '../../redux/selectors/index'
import { ipcSendAction } from '../../redux/actions/index'
import { AddonTable } from '../../components/dashboard/AddonTable'

class AddonTableContainer extends React.Component {
  render() {
    return <AddonTable {...this.props} />
  }
}

const mapStateToProps = (state) => {
  return {
    addonList: getAddonList(state)
  }
}

// mix of dispatch and non dispatch functions
const mapDispatchToProps = (dispatch) => {
  return {
    onInstall: (addonObj) => {dispatch(ipcSendAction('installAddon', addonObj))},
    onUpdate: (addonObj) => {dispatch(ipcSendAction('updateObj', addonObj))},
    onRemove: () => { /* NOOP */}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddonTableContainer)