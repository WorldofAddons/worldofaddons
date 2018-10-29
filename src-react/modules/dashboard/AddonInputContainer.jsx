import React from 'react'
import {connect} from 'react-redux'
import {ipcSendAction} from '../../redux/actions/index'
import { AddonInput } from '../../components/dashboard/AddonInput'

class AddonInputContainer extends React.Component {
  render() {
    return (
      <AddonInput
        {...this.props}
        buttonLabel='Add'
        inputLabel='Addon URL'
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

// mix of dispatch and non dispatch functions
const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (url) => {dispatch(ipcSendAction('newURL', url))}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddonInputContainer)