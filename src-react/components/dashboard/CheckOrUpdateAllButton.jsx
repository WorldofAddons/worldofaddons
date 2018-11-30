import React from 'react'

export class CheckOrUpdateAllButton extends React.Component {

    renderNothing() {
        return
    }

    renderButton() {
        //const tags = this.props.addonList.map((a, i) => this.renderRow(a, i))
        return (
            <button className='navBarItem waves-effect waves-green btn-small' onClick={``}>
                Check All
            </button>
        )
    }

    render () {
        const { addonList } = this.props
        const btn = addonList.length === 0 ? this.renderNothing() : this.renderButton()
        return (
            <div>
            {btn}
            </div>
        )
    }
}