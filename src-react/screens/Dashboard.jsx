import React from 'react'
import AddonInputContainer from '../modules/dashboard/AddonInputContainer'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'


export class Dashboard extends React.Component {
  render () {
    return (
      <div className='row section card-panel'>
        <AddonInputContainer />
        <AddonTableContainer />
      </div>
    )
  }
}
