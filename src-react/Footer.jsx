import React from 'react'
import ReactDOM from 'react-dom'
import { shell } from 'electron'
const { app } = window.require('electron').remote

class Footer extends React.PureComponent {
    openIssues () {
        // TODO: dangerous?
        shell.openExternal('https://github.com/WorldofAddons/worldofaddons/issues/new')
    }

    renderCopyright () {
        return (
        <div className="footer-copyright">
            <div className="container">
                {app.getVersion()}
            <a 
                className="grey-text text-lighten-4 right"
                onClick={this.openIssues.bind(this)}>
                Report an Bug
            </a>
            </div>
        </div>
        )
    }

    render () {
        return (
        <div className='grey page-footer'>
            {this.renderCopyright()}
        </div>
        )
    }
}

ReactDOM.render(<Footer />, document.getElementById('footer'))