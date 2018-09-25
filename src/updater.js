import fs from 'fs'
import { saveToAddonList } from './config'
const clonedeep = require('lodash.clonedeep')

export function integrityCheck(installedAddonsObj, configObj){
    console.log("integ check running")
    fetchAllAddonDirs(configObj.addonDir).then( dirobj => {
        verifyAllAddonDirs(installedAddonsObj, dirobj).then(verifyDict => {
            if (JSON.stringify(installedAddonsObj) !== JSON.stringify(verifyDict)){
                saveToAddonList(configObj, verifyDict).then(newDict => {
                    return newDict
                })
            }
        })
    })
}

// Returns a list of all addon folders in the user's addonDir
function fetchAllAddonDirs(addonDirPath) {
    return new Promise(function (resolve) {
        let allDirs = []    
        fs.readdirSync(addonDirPath).forEach(folder => {
        allDirs.push(folder)
        })
        return resolve(allDirs)
    })
}

// Checks if all addons are installed
function verifyAllAddonDirs(installedAddonsObj, directoryList) {
    const clone = clonedeep(installedAddonsObj)
    return new Promise(function (resolve) {
        for (const [name, addon] of Object.entries(clone)) {
            if (clone[name].subdirs.every(val => directoryList.includes(val)) === true){
                clone[name].status = "INSTALLED"
            }else {
                clone[name].status = "NOT INSTALLED"
            }
        }
        return resolve(clone)
    })
}

// Checks the addon's page for an update by comparing the parsed version 
// value to the JSON dictionary value.
// Only runs on addons whose statuses are "Installed"
// If an update is available, then set addon status to "Update Available"
function checkUpdate(addonObj) {
    return
}