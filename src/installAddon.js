import {parseCurseforgeDlUrl} from './curseforge'

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
    if (addonObj.host = "curseforge") {                                             // Check which host
        parseCurseforgeDlUrl(addonObj).then(function(curseDownloadUrl) {            // Parse the URL according to host
            downloadAddon(addonObj, curseDownloadUrl, targetPath).then(function(){  // Download the addon using the parsed URL
                addonObj = extAddonToDir(addonObj, targetPath)                      // After download is done extract the zip to target dir and delete the old zip
                console.log(addonObj)
                return addonObj
            })           
        }).catch(function(value) {
            return value
        })
    }
}

export function downloadAddon(addonObj, downloadUrl, targetPath) {
    return new Promise(function(resolve, reject){
        let request = require('request-promise');
        let fs = require('fs');
        let req = request({
            method: 'GET',
            uri: downloadUrl
        });
    
        const promiseToFinishDl=[];
        req.pipe(fs.createWriteStream(targetPath, {flags: 'w'}));
        promiseToFinishDl.push(req);
        
        let received_bytes = 0;
        let total_bytes = 0;
        req.on('response', function ( data ) {
            total_bytes = parseInt(data.headers['content-length']);
        });
    
        req.on('data', function(chunk) {
            received_bytes += chunk.length;
            let percentage = parseInt((received_bytes * 100) / total_bytes)
            const updateObj = {'name': addonObj.name, 'dlStatus': percentage}
            console.log(percentage)
            //ipcMain.send('updateObj', updateObj)
        });
    
        Promise.all(promiseToFinishDl).then(function(data) {
            console.log("\tDownload for " + addonObj.name + " completed.")
            return resolve()
            //ipcMain.send('downloadComplete', addonObj)
        });
    })
}

// Extracts the addon zip to target dir and delete the old zip, adds subdirs to list in addonObj
export function extAddonToDir(addonObj, targetPath) {

    console.log("\tExtracting " + addonObj.name + " to dir:" + targetPath)

    const decompress = require('decompress');
 
    decompress(targetPath, 'C:\\Users\\klam4\\Downloads\\' , {
        map: file => {
            file.path = file.path;
            //console.log(file.path)
            return file;
        }
    }).then(files => {
        let fs = require('fs');             // Quick and dirty delete the addon's .zip
        fs.unlink(targetPath, (err) => {
            if (err) throw err;
            console.log("Deleted " + targetPath);
          });


        files.forEach(function(part, index, files) {            // Quick and dirty record all addon dirs
            files[index] = files[index].path.split("/")[0];
          });
        let addonDirs = Array.from(new Set(files));
        console.log(addonDirs)
        addonObj.subdirs = addonDirs
        return addonObj         // NOTE: needs to be wrapped in a promise
    })
}
