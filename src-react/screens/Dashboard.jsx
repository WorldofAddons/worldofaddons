import React from 'react'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'
import {getThemePrimary, getThemeSecondary} from '../utils/index'
import AddonInputContainer from '../modules/dashboard/AddonInputContainer'
import SettingsContainer from '../modules/dashboard/SettingsContainer'
import { connect } from 'react-redux'

export class Dashboard extends React.Component {
  render () {
    const primaryCss = getThemePrimary(this.props.theme)
    const secondaryCss = getThemeSecondary(this.props.theme)
    return (
      <div className={`screen ${secondaryCss}`}>
        <div className={`row top-bar z-depth-2 ${primaryCss}`}>
          <div className='col s2'>
            <SettingsContainer />
          </div>
          <div className='col s1'></div>
          <div className='col s7'>
            <AddonInputContainer />
          </div>
          <div className='col s4'></div>

        </div>
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
