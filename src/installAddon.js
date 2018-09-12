import {parseDLURL_curseforge} from './curseforge'
import fs from 'fs'
import request from 'request-promise'
import decompress from 'decompress'
import { mainWindow } from '../main'
const os = require('os');
const path = require('path');

// Create HTTP object
export function makeHttpObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
    try {return new ActiveXObject("Msxml2.XMLHTTP");}
    catch (error) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP");}
    catch (error) {}
    throw new Error("Could not create HTTP request object.");
}

// Install the addon by chained-promises
export function installAddon(addonObj, targetPath) {
    return new Promise((resolve, reject) => {

        // Parse if host is CurseForge
        if (addonObj.host = "curseforge") {
            parseDLURL_curseforge(addonObj)
            .then((curseDownloadURL) => {
                //console.log(path.join(targetPath, addonObj.name + ".zip"))
                return downloadAddon(addonObj, curseDownloadURL)
            })
            .then(() => {  // Download the addon using the parsed URL
                return extAddonToDir(addonObj, targetPath) // After download is done extract the zip to target dir and delete the old zip
            })           
            .then((finalAddonObj) => {
                console.log(`\t${finalAddonObj.name} Installed.`)
                return resolve(finalAddonObj)
            })
        }
        // End of CurseForge
    })
}

export function downloadAddon(addonObj, downloadURL) {
    return new Promise((resolve, reject) => {
        let req = request({
            method: 'GET',
            uri: downloadURL
        })
        const dlDirectory = path.join(os.tmpdir(), addonObj.name + ".zip") // Download .zip to tempdir
        req.pipe(fs.createWriteStream(dlDirectory, {flags: 'w'}))
        
        let received_bytes = 0;
        let total_bytes = 0;
        req.on('response', (data) => {
            total_bytes = parseInt(data.headers['content-length'])
        })
    
        req.on('data', (chunk) => {
            received_bytes += chunk.length;
            let percentage = parseInt((received_bytes * 100) / total_bytes)
            const updateObj = {'name': addonObj.name, 'dlStatus': percentage} // TODO
            //console.log(percentage)
            mainWindow.webContents.send("updateAddonStatus", updateObj)
        });
    
        req.then((data) => {
            console.log("\tDownload for " + addonObj.name + " completed.")
            // send complete message to frontend
            return resolve()
        });
    })
}

// Extracts the addon zip to target dir and delete the old zip, adds subdirs to list in addonObj
export function extAddonToDir(addonObj, targetPath) {
    return new Promise((resolve, reject) => {
        const addonZip = path.join(os.tmpdir(), addonObj.name + ".zip")
        console.log(`\tExtracting ${addonObj.name} from ${addonZip} to dir: ${targetPath}`)
        
        decompress(addonZip, targetPath, {
            map: file => { return file }
        }).then(files => {
            fs.unlink(addonZip, (err) => {
                if (err) throw err;
                console.log(`\tDeleted ${addonZip}`)
            });
            
            files.forEach((part, index, files) => {            // Quick and dirty record all addon dirs
                files[index] = files[index].path.split("/")[0];
            });
            const addonDirs = Array.from(new Set(files));
            addonObj.subdirs = addonDirs
            return resolve(addonObj)
        })
    })
}
