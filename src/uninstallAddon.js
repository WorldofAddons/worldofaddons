import fs from 'fs'
import path from 'path'

// This function removes the specified addonObj from the installedAddonsDict and
// cleans the addon's subdirectories
export function uninstallAddon(addonObj, configObj, installedAddonsDict) {
    deleteSubdirs(addonObj.subdirs, configObj)
    delete installedAddonsDict[addonObj.name]
    return installedAddonsDict
}

// This function removes all subdirectories associated with the addon
function deleteSubdirs(dirList, configObj) {
    dirList.forEach(dir => { 
        let dirToDel = path.join(configObj.addonDir, dir)
        if (fs.existsSync(dirToDel) && (dirToDel !== configObj.addonDir)) {
            console.log(`\tDeleted ${dirToDel}`)
            rmDirRecursive(dirToDel)
        }
    })
}

// This function recursively removes the directories.
function rmDirRecursive(dir, rmSelf) {
    let files;
    rmSelf = (rmSelf === undefined) ? true : rmSelf;
    try { files = fs.readdirSync(dir); } catch (e) {console.log("!Oops, directory not exist."); return; }
    if (files.length > 0) {
        files.forEach(function(x, i) {
            let pathToDel = path.join(dir, x)
            if (fs.statSync(pathToDel).isDirectory()) {
                rmDirRecursive(pathToDel)
            } else {
                fs.unlinkSync(pathToDel)
            }
        });
    }
    fs.rmdirSync(dir)
}