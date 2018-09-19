// Modules to control application life and create native browser window
import {app, BrowserWindow} from 'electron'
import {checkWhichHost, parseAddonDetails_curseforge} from './src/parsePage'
import {installAddon} from './src/installAddon'
import {initConfig, initAddonList, saveToAddonList} from './src/config.js'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
  mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let configObj
let installedAddonsObj // Dictonary of all installed addons. Reference addons using "name" as key

initConfig().then((value) => { 
  configObj = value
  return value
}).then((value) => {
  initAddonList(value).then((value) => { 
    installedAddonsObj = value})
})

const {ipcMain} = require('electron')

// newURL listener
ipcMain.on('newURL', (e, newURL) => {
  console.log("Recieved new URL " + newURL)
  console.log("\tSending URL to be matched with host and parse addon page")
  const URLObj = checkWhichHost(newURL)
  if (URLObj.host === 'curseforge') {
    parseAddonDetails_curseforge(URLObj).then((value) => {
      mainWindow.webContents.send("newAddonObj", value)
    }).catch((value) => {
      mainWindow.webContents.send("error", value)
    })
  }
})

// installAddon() listener
ipcMain.on('installAddon', (e, addonObj) => {
  console.log("Recieved request to install addon " + addonObj.name)
  installAddon(addonObj, configObj.addonDir)
  .then((finalAddonObj) => {
    console.log("Final addon Obj: " + JSON.stringify(finalAddonObj))
    installedAddonsObj[finalAddonObj.name] = finalAddonObj
    return installedAddonsObj
  }).then((dict) => {
    saveToAddonList(configObj, dict)
  })
})

// Update download progress listener
ipcMain.on('updateObj', (event, updateObj) => {
  if (updateObj.hasOwnProperty("dlStatus")) {
    console.log("\tDownload Progress for " + updateObj.name + ": " + updateObj.dlStatus)
    mainWindow.webContents.send("updateAddonStatus", updateObj)
  }
})

// error listener
ipcMain.on('error', (event, errorObj) => {
  console.log("\tSending error message " + errorObj.error)
  mainWindow.webContents.send("error", errorObj)
})

