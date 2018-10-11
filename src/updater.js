import fs from 'fs'
import { saveToAddonList } from './config'
import { parseAddonDetails } from './parsePage'
import { mainWindow } from '../main'

export function integrityCheck (installedAddonsDict, configObj) {
  let changed = false
  console.log('Checking install integrity')
  fetchAllAddonDirs(configObj.addonDir)
    .then(dirList => {
      for (const [name] of Object.entries(installedAddonsDict)) {
        // Checks if addon is installed by making sure all subdirs are found in dirlist        
        if (installedAddonsDict[name].subdirs.every(val => dirList.includes(val)) !== true) {
          if (installedAddonsDict[name].status !== 'NOT INSTALLED') { // If addon is missing subdirs, then set status to not installed
            installedAddonsDict[name].status = 'NOT INSTALLED'        
            changed = true
          }
        }else {
          if (installedAddonsDict[name].status !== 'INSTALLED') { // If addon is not missing subdirs, then set status to installed
            console.log(name, installedAddonsDict[name].status)
            installedAddonsDict[name].status = 'INSTALLED'
            changed = true
          }
        }
      }
      return installedAddonsDict
    })
    .then(installedAddonsDict => {
      if (changed === true) {
        saveToAddonList(configObj, installedAddonsDict).then(newDict => {
          mainWindow.webContents.send('addonList', newDict)
          return newDict
        })
      }
    })
}

// Returns a list of all addon folders in the user's addonDir
function fetchAllAddonDirs (addonDirPath) {
  return new Promise(function (resolve) {
    let allDirs = []
    fs.readdirSync(addonDirPath).forEach(folder => {
      allDirs.push(folder)
    })
    return resolve(allDirs)
  })
}

// Checks the addon's page for an update by comparing the parsed version
// value to the JSON dictionary value.
// Only runs on addons whose statuses are "INSTALLED"
// If an update is available, then set addon status to "NEW UPDATE"
export function checkUpdate (addonObj) {
  return new Promise((resolve) => {
    if (addonObj.status !== 'NOT_INSTALLED') {
      parseAddonDetails(addonObj).then(checkedObj => {
        if (addonObj.version !== checkedObj.version) {
          console.log(`\tUpdate found: ${addonObj.displayName}\t${addonObj.version}\t${checkedObj.version}`)
          resolve('NEW UPDATE')
        } else {
          resolve('INSTALLED')
        }
      })
    } else {
      console.log(`\t${addonObj.displayName}\t${addonObj.version}\t${addonObj.status} - Not Checking`)
    }
  })
}
