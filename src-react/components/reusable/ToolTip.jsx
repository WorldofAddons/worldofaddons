import React from 'react'

export class ToolTip extends React.Component {
  render() {
    const { tip, label, position } = this.props

    return (
      <a className="tooltipped" data-position={position || 'top'} data-tooltip={tip}>{label}</a>
    )
  }
}