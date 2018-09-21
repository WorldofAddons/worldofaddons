import fs from 'fs'
import { saveToAddonList } from './config'

export function integrityCheck(installedAddonsObj, configObj){
    console.log("integ check running")
    let allDirs = fetchAllAddonDirs(configObj.addonDir)
    const verifyDict = verifyAllAddonDirs(installedAddonsObj, allDirs)
    if (JSON.stringify(installedAddonsObj) !== JSON.stringify(verifyDict)){
      //console.log("here!@@@@@@: ", verifyDict)
      saveToAddonList(configObj, verifyDict)
    }
    return verifyDict
}

// Returns a list of all addon folders in the user's addonDir
export function fetchAllAddonDirs(addonDirPath) {
    let allDirs = []    
    fs.readdirSync(addonDirPath).forEach(folder => {
      allDirs.push(folder)
    })
    return allDirs
}

// Checks if all addons are installed
export function verifyAllAddonDirs(addonDict, directoryList) {
    for (const [name, addon] of Object.entries(addonDict)) {
        addonDict[name] = verifyAddonDict(addon, directoryList)
    }
    return addonDict
}

// Checks the directory names of the addons directory against the subdirs 
// each addon is supposed to have according to the JSON dictionary
// If all match, then set addon status to "Installed"
// If it does not match, then set addon status to "Not installed"
export function verifyAddonDict(addonObj, directoryList) {
    if (addonObj.subdirs.every(val => directoryList.includes(val)) === true){
        addonObj.status = "INSTALLED"
    }else {
        addonObj.status = "NOT INSTALLED"
    }
    console.log(`${addonObj.name}\t\t${addonObj.status}`)
    return addonObj
}

// Checks the addon's page for an update by comparing the parsed version 
// value to the JSON dictionary value.
// Only runs on addons whose statuses are "Installed"
// If an update is available, then set addon status to "Update Available"
function checkUpdate(addonObj) {
    return
}