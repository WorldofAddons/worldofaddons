import React from 'react'
import { GetAddonInput } from '../components/GetAddonInput'
import { AddonTable } from '../components/AddonTable'


export class Dashboard extends React.Component {
  render () {
    return (
      <div className='row section card-panel'>
        <GetAddonInput />
        <AddonTable />
      </div>
    )
  }
}
