import React from 'react'

/**
 * Creates a button that will check for updates, update, or install an addon.
 * @param {object} AddonObj
 */
export const AddonControlButton = (addonObj, {onInstall, onInstallUpdate, onCheckUpdate}) => {
  switch (addonObj.status) {
    case 'INSTALLED': // Check update button
      return <button className='btn-small waves-effect waves-light light-blue darken-4'
               onClick={() => onCheckUpdate(addonObj)}><i className="material-icons">autorenew</i></button>
    case 'NEW UPDATE': // Install update Button
      return <button className='btn-small waves-effect waves-light amber darken-4'
               onClick={() => onInstallUpdate(addonObj)}><i className="material-icons">cloud_download</i></button>
    default: // Install Button
      return <button className='btn-small waves-effect waves-light green'
               onClick={() => onInstall(addonObj)}><i className="material-icons">get_app</i></button>
  }
}