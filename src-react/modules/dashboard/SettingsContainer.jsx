import React from 'react'
import { connect } from 'react-redux'
import { getSettings } from '../../redux/selectors/index'
import { ipcSendAction } from '../../redux/actions/index'
import { SettingsModal } from '../../components/dashboard/SettingsModal'

class SettingsContainer extends React.Component {
  render () {
    return (
      <SettingsModal {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: getSettings(state),
    theme: state.addons.settings.theme
  }
}

// mix of dispatch and non dispatch functions
const mapDispatchToProps = (dispatch) => {
  return {
    onSettings: () => { dispatch(ipcSendAction('getSettings', null)) },
    onNewSettings: (configObj) => { dispatch(ipcSendAction('newSettings', configObj)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
