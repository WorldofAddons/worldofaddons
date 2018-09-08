// Modules to control application life and create native browser window
import {app, BrowserWindow} from 'electron'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

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

function parsePage(newUrl) {
  console.log("parsePage() called")
  const win = new BrowserWindow({show: false})
  win.loadFile('./src/parsePage.html')
  console.log("\tHidden parsePage() window created")
  win.webContents.on('did-finish-load', function () {
      win.webContents.send('newUrl', newUrl);
      console.log("\tLoad successful, newUrl sent to parsePage.html")
  });
}

function installAddon(addonObj) {
  console.log("installAddon() called")
  const win = new BrowserWindow({show: false})
  win.loadFile('./src/installAddon.html')
  console.log("\tHidden installAddon() window created")
  win.webContents.on('did-finish-load', function () {
      win.webContents.send('addonObj', addonObj);
      console.log("\tLoad successful, addonObj sent to installAddon.html")
  });
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

const {ipcMain} = require('electron')

// newURL listener
ipcMain.on('newURL', (event, newURL) => {
  console.log("Recieved new URL " + newURL)
  console.log("\tSending URL to be matched with host and parse addon page")
  parsePage(newURL)
})

// error listener
ipcMain.on('error', (event, errorObj) => {
  console.log("\tSending error message " + errorObj.error)
  mainWindow.webContents.send("error", errorObj)
})

// newAddon listener
ipcMain.on('newAddonObj', (event, newAddonObj) => {
  console.log("Confirmed new addonObj is valid. Sending to mainWindow")
  console.log(newAddonObj)
  mainWindow.webContents.send("newAddonObj", newAddonObj)
})


// installAddon() listener
ipcMain.on('installAddon', (event, addonObj) => {
  console.log("Recieved request to install addon " + addonObj.name)
  if (addonObj.hasOwnProperty('error')) {
    console.log("\tSending error message" + addonObj.error)
    mainWindow.webContents.send("showError", String(addonObj.error))
  } else {
    console.log("\tCalling installAddon()")
    installAddon(addonObj)
  }
})

ipcMain.on('updateObj', (event, updateObj) => {
  if (updateObj.hasOwnProperty("dlStatus")) {
    console.log("\tDownload Progress for " + updateObj.name + ": " + updateObj.dlStatus)
    mainWindow.webContents.send("updateAddonStatus", updateObj)
  }
})

ipcMain.on('downloadComplete', (event, addonObj) => {
  console.log("\tDownload for " + addonObj.name + " completed")
})
