import React from 'react'
import { GetAddonInput } from '../components/GetAddonInput'
const { app } = window.require('electron').remote

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <GetAddonInput />
        <p>
          Version: {app.getVersion()}
        </p>
      </div>
    );
  }
}

module.exports = Dashboard