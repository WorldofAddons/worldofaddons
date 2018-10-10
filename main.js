// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron'
import { parseAddonDetails } from './src/parsePage'
import { checkWhichHost } from './src/checkWhichHost/index'
import { installAddon } from './src/installAddon'
import { initConfig, readAddonList, saveToAddonList } from './src/config'
import { integrityCheck, checkUpdate } from './src/updater'

const chokidar = require('chokidar')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

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

function checkAllUpdates (installedAddonsDict) {
  Object.keys(installedAddonsDict).forEach(function (key) {
    checkUpdate(installedAddonsDict[key]).then(checkedStatus => {
      installedAddonsDict[key].status = checkedStatus
      saveToAddonList(configObj, installedAddonsDict)
      console.log(`\tChecking \t${installedAddonsDict[key].displayName}\t${installedAddonsDict[key].version}\t${installedAddonsDict[key].status}`)
    })
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

// --- Initialization Start---
let configObj // JSON object that holds application config such as location of addon directory and installed addons file
let installedAddonsDict // Dictionary of all installed addons. Reference addons using "name" as key

initConfig()
  .then(value => {
    configObj = value // Sets config settings
    return configObj
  })
  .then(configObj => {
    readAddonList(configObj).then(val => {
      if (configObj.checkUpdateOnStart === true) {
        checkAllUpdates(val)
      }
    })
    
    const installedAddonsJsonWatcher = chokidar.watch(configObj.addonRecordFile, { persistent: true }) // Watches for changes in addons.json,
    installedAddonsJsonWatcher.on('all', function () { // if there are changes then update the installAddonsDict variable.
      readAddonList(configObj).then(value => {
        console.log('addons.json changed, updating installedAddonsDict')
        installedAddonsDict = value
      })
    })
  })
  .then(val => {
    const subDirWatcher = chokidar.watch(configObj.addonDir, { // Watches wow Addon folder for new addons or deletions
      ignored: /(^|[/\\])\../,
      persistent: true,
      depth: 0
    })
    subDirWatcher
      .on('addDir', function (path) {
        if (path !== configObj.addonDir) {
          console.log('Addon subdir: ', path)
          integrityCheck(installedAddonsDict, configObj) // Verifies that addon was installed
        }
      })
      .on('unlinkDir', function (path) {
        if (path !== configObj.addonDir) {
          console.log('Addon deleted: ', path)
          integrityCheck(installedAddonsDict, configObj) // Verifies that addon was uninstalled
        }
      })
      .on('error', function (error) {
        console.log('ERROR: ', error)
      })
      .on('raw', function (event, path, details) {
        console.log('Raw event:', event, path, details)
      })
  })
//  --- Initialization End---

const { ipcMain } = require('electron')

// newURL listener
ipcMain.on('newURL', (e, newURL) => {
  console.log('Received new URL ' + newURL)
  console.log('\tSending URL to be matched with host and parse addon page')
  const URLObj = checkWhichHost(newURL)
  parseAddonDetails(URLObj).then(addonObj => {
    mainWindow.webContents.send('newAddonObj', addonObj)
  }).catch((err) => {
    mainWindow.webContents.send('error', err)
  })
})

// installAddon() listener
ipcMain.on('installAddon', (e, addonObj) => {
  console.log('Received request to install addon ' + addonObj.name)
  installAddon(addonObj, configObj.addonDir)
    .then((newAddon) => {
      installedAddonsDict[newAddon.name] = newAddon
      saveToAddonList(configObj, installedAddonsDict)
      integrityCheck(installedAddonsDict, configObj)
    })
})

// updateAddon() listener
ipcMain.on('checkAddonUpdate', (e, addonObj) => {
  console.log('Received request to check addon for updates')
  checkUpdate(addonObj).then(resultObj => {
    installedAddonsDict[addonObj].version = resultObj.version
    installedAddonsDict[addonObj].status = resultObj.status
    saveToAddonList(configObj, installedAddonsDict)
  })
})

// Update download progress listener
ipcMain.on('updateObj', (e, updateObj) => {
  if (updateObj.hasOwnProperty('dlStatus')) {
    console.log('\tDownload Progress for ' + updateObj.name + ': ' + updateObj.dlStatus)
    mainWindow.webContents.send('updateAddonStatus', updateObj)
  }
})

// error listener
ipcMain.on('error', (e, errorObj) => {
  console.log('\tSending error message ' + errorObj.error)
  mainWindow.webContents.send('error', errorObj)
})
