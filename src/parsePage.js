const { ipcRenderer } = require('electron')

export function checkWhichHost(url) {
    if (url.startsWith("https://www.curseforge.com/wow/addons/")) {
        return parseCurseforgeUrl(url)
    }
    var errorObj = {'error': "ERROR: Invalid URL '" + url + "'. Given link does not match parse"}
    return errorObj
}

// curseforge
export function parseCurseforgeUrl(url) {
    var urlSplit = url.split("https://www.curseforge.com/wow/addons/")
    if (urlSplit.length === 2) {
        var urlObj = {'url': url, 'host': "curseforge", 'name': urlSplit[1]}
        return urlObj
    }
    var errorObj = {'error': "ERROR: Invalid URL '" + url + "'."}
    return errorObj
}

export function curseForge(urlObj) {
    var req = makeHttpObject();
    req.open("GET", urlObj.url + "/files", true);
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4){
            var pageHTML = req.responseText
            var parser = new DOMParser();
            var page = parser.parseFromString(pageHTML, "text/html");
            
            // Check if URL is 404
            if (page.getElementsByClassName('error-page').length != 0){
                var errorObj = {'error': "ERROR: Invalid URL '" + urlObj.url + "'."}
                return errorObj
            }
            var version = page.getElementsByClassName('table__content file__name full')[0].innerHTML

            var addonObj = {
                'name': urlObj.name,
                'version': version,
                'host': urlObj.host,
                'url': urlObj.url
            }
            console.log(addonObj)
            ipcRenderer.send('newAddonObj', addonObj)
        }
    };

    req.onloadend = function() {
    if(req.status == 404)
        var errorObj = {'error': "ERROR: Invalid URL 404 '" + urlObj.url + "'."}
        ipcRenderer.send('error', errorObj)
    }
}

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