import React from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import { getAddonList } from '../../redux/selectors/index.selectors'
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
    onInstall: (addonObj) => {ipcRenderer.send('installAddon', addonObj)},
    onUpdate: (addonObj) => {ipcRenderer.send('updateObj', addonObj)},
    onRemove: () => { /* NOOP */}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddonTableContainer)