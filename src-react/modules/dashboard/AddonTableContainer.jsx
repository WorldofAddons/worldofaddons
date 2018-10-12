import React from 'react'
import { connect } from 'react-redux'
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

const mapDispatchToProps = (dispatch) => {
  return {
    onInstall: () => {},
    onUpdate: () => {},
    onRemove: () => {}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddonTableContainer)