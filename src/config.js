import fs from 'fs'
import path from 'path'
import os from 'os'

export function initConfig () {
  return new Promise((resolve, reject) => {
    const homedir = os.homedir() // Fetchs user's homedir
    const worldOfAddonsDir = path.join(homedir, 'WorldOfAddons') // World of Addons stores information in user's home dir
    const WoAConfig = path.join(worldOfAddonsDir, 'config.json') // Saves all config information in config.json
    let configObj // Init configObj
    if (!fs.existsSync(worldOfAddonsDir)) {
      fs.mkdirSync(worldOfAddonsDir)
    }

    // If config.json does not exist, create it with blank values
    if (!fs.existsSync(WoAConfig)) {
      configObj = {
        'addonDir': '', // Path to wow addon folder (init to blank for now)
        'addonRecordFile': path.join(worldOfAddonsDir, 'addons.json'), // Path to file storing addon records
        'checkUpdateOnStart': false // If true, then check for update on start
      }
      fs.writeFile(WoAConfig, JSON.stringify(configObj, null, 2), 'utf8', (err) => reject(err))
      return resolve(configObj)
    }
    try {
      return resolve(JSON.parse(fs.readFileSync(WoAConfig, 'utf8')))
    } catch (err) {
      return reject(err)
    }
  })
}

export function readAddonList (configObj) {
  return new Promise((resolve, reject) => {
    const addonList = configObj.addonRecordFile

    // If addons.json does not exist, create it with blank values
    if (!fs.existsSync(addonList)) {
      fs.writeFile(addonList, '{}', 'utf8', (err) => reject(err)) // Init empty dictionary
      return resolve({})
    }

    try {
      let addonFile = JSON.parse(fs.readFileSync(addonList, 'utf8'))
      return resolve(addonFile)
    } catch (err) {
      return reject(err)
    }
  })
}

export function saveToAddonList (configObj, installedDict) {
  return new Promise(function (resolve, reject) {
    console.log('\tUpdating addons.js')
    const stringInstallDict = JSON.stringify(installedDict, null, 2)
    fs.writeFile(configObj.addonRecordFile, stringInstallDict, 'utf8', (err) => reject(err))
    return resolve(installedDict)
  })
}
