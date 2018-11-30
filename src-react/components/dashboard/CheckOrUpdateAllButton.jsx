import React from 'react'

export class CheckOrUpdateAllButton extends React.Component {

    renderCheckButton(notChecked) {
        if (notChecked.length >= 1) {
            return <button className='waves-effect waves-green btn-small btn-pad-left' onClick={(e) => this.props.onCheckAll(notChecked)}>Check All</button>
        }
    }

    renderUpdateButton(notUpdated) {
        if (notUpdated.length >= 1) {
            return <button className='waves-effect waves-green btn-small btn-pad-left' onClick={(e) => this.props.onUpdateAll(notUpdated)}>Update All</button>
        }
    }

    render () {
        const { addonList } = this.props
        let notChecked = []
        let notUpdated = []
        Object.keys(addonList).forEach(function(key) {
            if (addonList[key].status === "INSTALLED") {
                notChecked.push(addonList[key])
            }
            if (addonList[key].status === "NEW_UPDATE") {
                notUpdated.push(addonList[key])
            }
        })

        return (
            <div>
                {this.renderCheckButton(notChecked)}
                {this.renderUpdateButton(notUpdated)}
            </div>
        )
    }
}