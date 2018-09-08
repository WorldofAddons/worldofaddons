// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import './src/parsePage.js'
import './src/installAddon.js'

const { ipcRenderer } = require('electron')

ipcRenderer.on('newUrl' , function(event , newUrl){
    console.log("URL: " + newUrl)
    var urlObj = checkWhichHost(newUrl)
    if (urlObj.hasOwnProperty('error')) {
        ipcRenderer.send('error', urlObj)
        window.close()
    }
    
    if (urlObj.host === "curseforge"){                  // If URL host is curseforge, parse the page
        console.log("URL host matched to Curseforge")
        curseForge(urlObj)
    }
})

ipcRenderer.on('addonObj' , function(event , addonObj){
    console.log(addonObj)
    var targetPath = "C:\\Users\\khlam\\Downloads\\" + addonObj.name + ".zip" // change later, set for testing
    var pageHTML = ""
    var req = makeHttpObject();
    req.open("GET", addonObj.url+"/download", true);
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4){
            var pageHTML = req.responseText
            if (addonObj.host = "curseforge") {
                var downloadURL = parseCurseforgeHTML(pageHTML)
                downloadAddon(downloadURL, targetPath, addonObj)
            }
        }
    }; 
})