const { ipcRenderer } = require('electron')

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

export function downloadAddon(downloadUrl, targetPath, addonObj) {
    var request = require('request-promise');
    var fs = require('fs');
    var req = request({
        method: 'GET',
        uri: downloadUrl
    });

    var promiseToFinishDl=[];
    req.pipe(fs.createWriteStream(targetPath, {flags: 'w'}));
    promiseToFinishDl.push(req);
    
    var updateObj
    var received_bytes = 0;
    var total_bytes = 0;
    req.on('response', function ( data ) {
        total_bytes = parseInt(data.headers['content-length']);
    });

    req.on('data', function(chunk) {
        received_bytes += chunk.length;
        var percentage = parseInt((received_bytes * 100) / total_bytes)
        updateObj = {'name': addonObj.name, 'dlStatus': percentage}
        console.log(percentage)
        ipcRenderer.send('updateObj', updateObj)
    });

    Promise.all(promiseToFinishDl).then(function(data) {
        console.log("\tDownload for " + addonObj.name + " completed.")
        const { ipcRenderer } = require('electron')
        addonObj.subdir="NOT_IMPL"
        ipcRenderer.send('downloadComplete', addonObj)
    });         
}