import React from 'react'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'
import {getThemeSecondary} from '../utils/index'
import AddonInputContainer from '../modules/dashboard/AddonInputContainer'
import SettingsContainer from '../modules/dashboard/SettingsContainer'
import { connect } from 'react-redux'

export class Dashboard extends React.Component {
  render () {
    const containerCss = getThemeSecondary(this.props.theme)

    return (
      <div className={`screen ${containerCss}`}>
        <AddonInputContainer />
        <SettingsContainer />
        <AddonTableContainer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.addons.settings.theme
  }
}

export default connect(
  mapStateToProps,
  null
)(Dashboard)
