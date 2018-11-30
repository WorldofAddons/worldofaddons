import React from 'react'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'
import {getThemePrimary, getThemeSecondary} from '../utils/index'
import SettingsContainer from '../modules/dashboard/SettingsContainer'
import AddonInputContainer from '../modules/dashboard/AddonInputContainer'
import CheckOrUpdateAllButtonContainer from '../modules/dashboard/CheckOrUpdateAllButtonContainer'
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
          <div className='offset-s1 col s6'>
            <AddonInputContainer />
          </div>
          <div className='offset-s1 col s2'>
          </div>
        </div>
        <CheckOrUpdateAllButtonContainer />
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
