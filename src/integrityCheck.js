import fs from 'fs'
import { saveToAddonList } from './config'
import { mainWindow } from '../main'
const HashMap = require('hashmap')

// Verifies that all addon subdirs are present. Updates addon statuses accordingly
// In many cases subDirCheckAll() is inefficient because it checks the entire filesystem
export function subDirCheckAll (installedAddonsDict, configObj) {
  let changed = false
  console.log('\t ::: subDir check started  :::')
  fetchAllAddonDirs(configObj.addonDir)
    .then(dirList => {
      Object.keys(installedAddonsDict).forEach((addonName) => { // Checks if addon is installed by making sure all subdirs are found in dirlist
        if (installedAddonsDict[addonName].subdirs.every(val => dirList.includes(val)) !== true) {
          if (installedAddonsDict[addonName].status !== 'NOT INSTALLED') { // If addon is missing subdirs, then set status to not installed
            installedAddonsDict[addonName].status = 'NOT INSTALLED'
            mainWindow.webContents.send('modAddonObj', installedAddonsDict[addonName])
            changed = true
          }
        } else {
          if (installedAddonsDict[addonName].status !== 'INSTALLED' && installedAddonsDict[addonName].status !== 'NEW_UPDATE') { // If addon is not missing subdirs
            console.log("\t", addonName, "\t",installedAddonsDict[addonName].status) //  and it doesn't need an update then set status to installed
            installedAddonsDict[addonName].status = 'INSTALLED'
            mainWindow.webContents.send('modAddonObj', installedAddonsDict[addonName])
            changed = true
          }
        }
      })
      return installedAddonsDict
    })
    .then(installedAddonsDict => {
      if (changed === true) {
        saveToAddonList(configObj, installedAddonsDict).then(newDict => {
          return newDict
        })
      }
      console.log('\t ::: subDir check complete  :::')
    })
}

export function initFileHash(fileHash, installedAddonsDict) {
  fileHash = new HashMap(); // Hashmap that holds all subdirectory names
  Object.keys(installedAddonsDict).forEach((addonName) => {
    installedAddonsDict[addonName].subdirs.forEach(fname => {
      fileHash.set(fname, addonName)
    })
  })
  return fileHash
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
