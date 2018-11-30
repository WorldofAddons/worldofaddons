import React from 'react'

/**
 * Creates a button that will check for updates, update, or install an addon.
 * @param {object} AddonObj
 */
export const AddonControlButton = (addonObj, { onInstall, onInstallUpdate, onCheckUpdate }) => {
  switch (addonObj.status) {
    case 'INSTALLED': // Check update button
      return <button className='waves-effect waves-yellow btn-small'
        onClick={() => onCheckUpdate(addonObj)}><i className='material-icons'>autorenew</i></button>
    case 'NEW_UPDATE': // Install update Button
      return <button className='waves-effect waves-orange btn-small'
        onClick={() => onInstallUpdate(addonObj)}><i className='material-icons orange-text text-darken-1'>cloud_download</i></button>
    case 'NO_UPDATE': // No Update, show checkmark
      return <i className='material-icons green-text text-darken-4'>check_circle_outline</i>
    default: // Install Button
      return <button className='waves-effect waves-teal btn-small light-green'
        onClick={() => onInstall(addonObj)}><i className='material-icons'>get_app</i></button>
  }
}
