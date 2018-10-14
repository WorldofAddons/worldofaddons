import React from 'react'

/**
 * Creates a button that will check for updates, update, or install an addon.
 * @param {object} AddonObj
 */
export const AddonControlButton = (addonObj, {onInstall, onInstallUpdate, onCheckUpdate}) => {
  
  switch (addonObj.status) {
    case 'INSTALLED':
      return <button className='btn-small waves-effect waves-light'
               onClick={() => onCheckUpdate(addonObj)}>Check Update</button>
    case 'NEW UPDATE':
      return <button className='btn-small waves-effect waves-light'
               onClick={() => onInstallUpdate(addonObj)}>Update</button>
    default:
      return <button className='btn-small waves-effect waves-light'
               onClick={() => onInstall(addonObj)}>Install</button>
  }
}