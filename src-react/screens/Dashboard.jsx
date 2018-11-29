import React from 'react'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'
import {getThemeSecondary} from '../utils/index'

export class Dashboard extends React.Component {
  render () {
    const containerCss = getThemeSecondary(this.props.theme)
    return (
      <div className={`row ${containerCss}`}>
        <AddonTableContainer />
      </div>
    )
  }
}
