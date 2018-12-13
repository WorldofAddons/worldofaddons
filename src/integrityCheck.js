import fs from 'fs'
import { saveToAddonList } from './config'
import { mainWindow } from '../main'

// Verifies that all addon subdirs are present. Updates addon statuses accordingly
// In many cases integrityCheck() is inefficient because it checks the entire filesystem
export function integrityCheck (installedAddonsDict, configObj) {
  let changed = false
  console.log('Checking install integrity')
  fetchAllAddonDirs(configObj.addonDir)
    .then(dirList => {
      for (const [name] of Object.entries(installedAddonsDict)) { // Checks if addon is installed by making sure all subdirs are found in dirlist
        if (installedAddonsDict[name].subdirs.every(val => dirList.includes(val)) !== true) {
          if (installedAddonsDict[name].status !== 'NOT INSTALLED') { // If addon is missing subdirs, then set status to not installed
            installedAddonsDict[name].status = 'NOT INSTALLED'
            mainWindow.webContents.send('modAddonObj', installedAddonsDict[name])
            changed = true
          }
        } else {
          if (installedAddonsDict[name].status !== 'INSTALLED' && installedAddonsDict[name].status !== 'NEW_UPDATE') { // If addon is not missing subdirs
            console.log(name, installedAddonsDict[name].status) //  and it doesn't need an update then set status to installed
            installedAddonsDict[name].status = 'INSTALLED'
            mainWindow.webContents.send('modAddonObj', installedAddonsDict[name])
            changed = true
          }
        }
      }
      return installedAddonsDict
    })
    .then(installedAddonsDict => {
      if (changed === true) {
        saveToAddonList(configObj, installedAddonsDict).then(newDict => {
          // mainWindow.webContents.send('addonList', newDict)
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
