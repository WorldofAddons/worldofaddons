import React from 'react'
import { connect } from 'react-redux'
import { ipcSendAction } from '../../redux/actions/index'
import { CheckOrUpdateAllButton } from '../../components/dashboard/CheckOrUpdateAllButton'
import { getAddonList } from '../../redux/selectors/index'

class CheckOrUpdateAllButtonContainer extends React.Component {
  render () {
    return (
      <CheckOrUpdateAllButton {...this.props}/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    addonList: getAddonList(state),
    theme: state.addons.settings.theme
  }
}

// mix of dispatch and non dispatch functions
const mapDispatchToProps = (dispatch) => {
  return {
      onCheckAll: () => { dispatch(ipcSendAction('checkAll', null)) },
      onUpdateAll: () => { dispatch(ipcSendAction('updateAll', null)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckOrUpdateAllButtonContainer)
