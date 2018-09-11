import {parseCurseforgeDlUrl} from './curseforge'
import fs from 'fs'
import request from 'request-promise'
import decompress from 'decompress'

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
    if (addonObj.host = "curseforge") {
        parseCurseforgeDlUrl(addonObj)
        .then((curseDownloadUrl) => {
            return downloadAddon(addonObj, curseDownloadUrl, targetPath)
        })
        .then(() => {  // Download the addon using the parsed URL
            addonObj = extAddonToDir(addonObj, targetPath) // After download is done extract the zip to target dir and delete the old zip
            console.log(addonObj)
            return addonObj
        })           
        .catch((value) => {
            return value
        })
    }
}

export function downloadAddon(addonObj, downloadUrl, targetPath) {
    return new Promise((resolve, reject) => {
        let req = request({
            method: 'GET',
            uri: downloadUrl
        })
    
        req.pipe(fs.createWriteStream(targetPath, {flags: 'w'}))
        
        let received_bytes = 0;
        let total_bytes = 0;
        req.on('response', (data) => {
            total_bytes = parseInt(data.headers['content-length'])
        })
    
        req.on('data', (chunk) => {
            received_bytes += chunk.length;
            let percentage = parseInt((received_bytes * 100) / total_bytes)
            const updateObj = {'name': addonObj.name, 'dlStatus': percentage} // TODO
            console.log(percentage)
        });
    
        req.then((data) => {
            console.log("\tDownload for " + addonObj.name + " completed.")
            return resolve()
        });
    })
}

// Extracts the addon zip to target dir and delete the old zip, adds subdirs to list in addonObj
export function extAddonToDir(addonObj, targetPath) {
    console.log(`\tExtracting ${addonObj.name}to dir: ${targetPath}`)
 
    decompress(targetPath, 'C:\\Users\\klam4\\Downloads\\' , {
        map: file => {
            file.path = file.path
            //console.log(file.path)
            return file
        }
    }).then(files => {
        fs.unlink(targetPath, (err) => {
            if (err) throw err;
            console.log("Deleted " + targetPath)
        });
        
        files.forEach((part, index, files) => {            // Quick and dirty record all addon dirs
            files[index] = files[index].path.split("/")[0];
        });
        const addonDirs = Array.from(new Set(files));
        console.log(addonDirs)
        addonObj.subdirs = addonDirs
        return addonObj // TODO: needs to be wrapped in a promise
    })
}
