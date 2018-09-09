// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import {
    curseForge,
    checkWhichHost
} from './parsePage.js'
import {
    downloadAddon
} from './installAddon.js'
import { parseCurseforgeHTML } from './curseforge'
import { ipcRenderer } from 'electron'

ipcRenderer.on('newUrl', (e, newUrl) =>{
    console.log("URL: " + newUrl)
    const urlObj = checkWhichHost(newUrl)
    if (urlObj.hasOwnProperty('error')) {
        ipcRenderer.send('error', urlObj)
    }
    
    if (urlObj.host === "curseforge"){                  // If URL host is curseforge, parse the page
        console.log("URL host matched to Curseforge")
        curseForge(urlObj)
    }
})

ipcRenderer.on('addonObj', (e, addonObj) => {
    console.log(addonObj)

    // TODO: change install path
    const targetPath = `C:\\Users\\khlam\\Downloads\\${addonObj.name}.zip`
    let pageHTML = ""
    let req = makeHttpObject();
    req.open("GET", addonObj.url+"/download", true);
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.responseText && addonObj.host === "curseforge"){
            const pageHTML = req.responseText
            const downloadURL = parseCurseforgeHTML(pageHTML)
            downloadAddon(downloadURL, targetPath, addonObj)
        }
    }
})