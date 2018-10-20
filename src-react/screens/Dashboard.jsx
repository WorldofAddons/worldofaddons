import React from 'react'
import AddonInputContainer from '../modules/dashboard/AddonInputContainer'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'

export class NavBar extends React.Component {
  render () {
    return (
      <div className='row'>
        <AddonInputContainer/>
      </div>
    )
  }
}

export class Dashboard extends React.Component {
  render () {
    return (
      <div className='row'>
        <AddonTableContainer />
      </div>
    )
  }
}
