import React from 'react'

export class CheckOrUpdateAllButton extends React.Component {

    renderCheckButton() {
        const { addonList } = this.props
        let notChecked = []
        Object.keys(addonList).forEach(function(key) {
            if (addonList[key].status === "INSTALLED") {
                notChecked.push(addonList[key].name)
            }
        })

        if (notChecked.length >= 1) { // doesn't do anything yet
            return (
                <div className='col s3'>
                    <button className='navBarItem waves-effect waves-green btn-small' >
                        Check All
                    </button>
                </div>
            )
        }
    }

    render () {
        return (
            <div>
                {this.renderCheckButton()}
            </div>
        )
    }
}