import React from 'react'
const { app } = window.require('electron').remote

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <p>
          Version: {app.getVersion()}
        </p>
      </div>
    );
  }
}

module.exports = Dashboard