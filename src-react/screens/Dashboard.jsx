import React from 'react'
import { GetAddonInput } from '../components/dashboard/GetAddonInput'
import AddonTableContainer from '../modules/dashboard/AddonTableContainer'


export class Dashboard extends React.Component {
  render () {
    return (
      <div className='row section card-panel'>
        <GetAddonInput />
        <AddonTableContainer />
      </div>
    )
  }
}
