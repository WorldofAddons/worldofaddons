import { parseAddonDetails } from './parsePage'

// Checks the addon's page for an update by comparing the parsed version
// value to the JSON dictionary value.
// Only runs on addons whose statuses are "INSTALLED"
// If an update is available, then set addon status to "NEW_UPDATE"
export function checkUpdate (addonObj) {
  return new Promise((resolve) => {
    if (addonObj.status !== 'NOT_INSTALLED') {
      parseAddonDetails(addonObj).then(checkedObj => {
        if (addonObj.version !== checkedObj.version) {
          console.log(`\tUpdate found: ${addonObj.displayName}\t${addonObj.version}\t${checkedObj.version}`)
          resolve('NEW_UPDATE')
        } else {
          console.log(`\tAddon ${addonObj.displayName} [${addonObj.version}] is latest version`)
          resolve('INSTALLED')
        }
      })
    } else {
      console.log(`\t${addonObj.displayName}\t${addonObj.version}\t${addonObj.status} - Not Checking`)
    }
  })
}
