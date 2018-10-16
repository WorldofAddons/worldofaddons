import React from 'react'
import ReactDOM from 'react-dom'
import { shell } from 'electron'
const { app } = window.require('electron').remote

export class Footer extends React.PureComponent {
  openIssues() {
    // TODO: dangerous?
    shell.openExternal('https://github.com/WorldofAddons/worldofaddons/issues/new')
  }

  renderIssuesBtn() {
    return (
      <button
        className='btn-small waves-effect waves-light right'
        onClick={this.openIssues.bind(this)}
      >
        Report a Bug
        </button>
    )
  }

  renderCopyright() {
    return (
      <div className="footer-copyright">
        <div className="container">
          Version: {app.getVersion()}
          {this.renderIssuesBtn()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='grey page-footer'>
        {this.renderCopyright()}
      </div>
    )
  }
}