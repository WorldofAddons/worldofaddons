import React from 'react'

/**
 * Creates a button that will check for updates, update, or install an addon.
 * @param {object} AddonObj
 */
export const AddonControlButton = (addonObj, { onInstall, onInstallUpdate, onCheckUpdate }) => {
  switch (addonObj.status) {
    case 'INSTALLED': // Check update button
      return <button className='waves-effect waves-yellow btn-flat btn-small'
        onClick={() => onCheckUpdate(addonObj)}><i className='material-icons'>autorenew</i></button>
    case 'NEW_UPDATE': // Install update Button
      return <button className='waves-effect waves-orange btn-flat btn-small orange'
        onClick={() => onInstallUpdate(addonObj)}><i className='material-icons'>cloud_download</i></button>
    default: // Install Button
      return <button className='waves-effect waves-green btn-flat btn-small light-green'
        onClick={() => onInstall(addonObj)}><i className='material-icons'>get_app</i></button>
  }
}
