import React from 'react'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'

export class Dashboard extends React.Component {
  render () {
    return (
      <div className='row'>
        <AddonTableContainer />
      </div>
    )
  }
}
