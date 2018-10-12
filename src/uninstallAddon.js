import fs from 'fs'
import path from 'path'


export function uninstallAddon(addonObj, configObj, installedAddonsDict) {
    deleteSubdirs(addonObj.subdirs, configObj)
    delete installedAddonsDict[addonObj.name]
    return installedAddonsDict
}

function rmDirRecursive(dir, rmSelf) {
    let files;
    rmSelf = (rmSelf === undefined) ? true : rmSelf;
    dir =  dir + "/";
    try { files = fs.readdirSync(dir); } catch (e) { console.log("!Oops, directory not exist."); return; }
    if (files.length > 0) {
        files.forEach(function(x, i) {
            if (fs.statSync(dir + x).isDirectory()) {
                rmDirRecursive(dir + x)
            } else {
                fs.unlinkSync(dir + x)
            }
        });
    }
    fs.rmdirSync(dir)
}

function deleteSubdirs(dirList, configObj) {
    for (let i = 0; i < dirList.length; i++) {
        let dirToDel = path.join(configObj.addonDir, dirList[i])
        if (fs.existsSync(dirToDel)) {
            console.log(`\tDeleted ${dirToDel}`)
            rmDirRecursive(dirToDel)
        }
    }
}