import React from 'react'
import { connect } from 'react-redux'
import { getAddonList } from '../../redux/selectors/index'
import { ipcSendAction } from '../../redux/actions/index'
import { AddonTable } from '../../components/dashboard/AddonTable'

class AddonTableContainer extends React.Component {
  render () {
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
    onInstall: (addonObj) => { dispatch(ipcSendAction('installAddon', addonObj)) },
    onCheckUpdate: (addonObj) => { dispatch(ipcSendAction('checkAddonUpdate', addonObj)) },
    onUpdate: (addonObj) => { dispatch(ipcSendAction('updateObj', addonObj)) },
    onInstallUpdate: (addonObj) => { dispatch(ipcSendAction('installUpdate', addonObj)) },
    onRemove: (addonObj) => { dispatch(ipcSendAction('uninstallAddon', addonObj)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddonTableContainer)
