// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron'
import { parseAddonDetails } from './src/parsePage'
import { checkWhichHost } from './src/checkWhichHost/index'
import { installAddon } from './src/installAddon'
import { initConfig, readAddonList, saveToAddonList } from './src/config'
import { checkUpdate } from './src/updater'
import { MIN_WINDOW_SIZE } from './constants/index'
import { uninstallAddon } from './src/uninstallAddon'
import { integrityCheck } from './src/integrityCheck'
import chokidar from 'chokidar'
import _ from 'lodash'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let mainWindow

function createWindow () {
  // Create the browser window.
  const windowSettings = _.extend(MIN_WINDOW_SIZE, { icon: __dirname + './assets/200x200.png' })
  mainWindow = new BrowserWindow(windowSettings)
  mainWindow.setMinimumSize(MIN_WINDOW_SIZE.width, MIN_WINDOW_SIZE.height)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  if (process.env.ENV === 'dev') {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.setMenu(null)
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function checkAllUpdates (installedAddonsDict, configObj) {
  Object.keys(installedAddonsDict).forEach(function (key) {
    checkUpdate(installedAddonsDict[key]).then(checkedStatus => {
      if (installedAddonsDict[key].status !== checkedStatus){
        installedAddonsDict[key].status = checkedStatus
        saveToAddonList(configObj, installedAddonsDict)
      }
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
      installedAddonsDict = val
      if (configObj.checkUpdateOnStart === true) {
        checkAllUpdates(val, configObj)
      }
      return val
    })
    const installedAddonsJsonWatcher = chokidar.watch(configObj.addonRecordFile, { persistent: true }) // Watches for changes in addons.json,
    installedAddonsJsonWatcher.on('all', function () { // if there are changes then update the installAddonsDict variable.
      readAddonList(configObj).then(value => {
        console.log('Save/change detected in addons.json, updating installedAddonsDict')
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
      integrityCheck(installedAddonsDict, configObj)
    })
})

// update addon listener, fetches new version number and downloads the addon
ipcMain.on('installUpdate', (e, addonObj) => {
  console.log('Received request to update addon ' + addonObj.name)
  const URLObj = checkWhichHost(addonObj.URL)
  parseAddonDetails(URLObj).then(addonObj => {
    installAddon(addonObj, configObj.addonDir)
    .then((newAddon) => {
      installedAddonsDict[newAddon.name] = newAddon
      integrityCheck(installedAddonsDict, configObj)
    })
  })
})

// checkAddonUpdate() listener
ipcMain.on('checkAddonUpdate', (e, addonObj) => {
  console.log(`Received request to check ${addonObj.name} for updates`)
  checkUpdate(addonObj).then(updateStatus => {
    if (installedAddonsDict[addonObj.name].status !== updateStatus) {
      console.log(installedAddonsDict[addonObj.name].status, updateStatus)
      installedAddonsDict[addonObj.name].status = updateStatus
      saveToAddonList(configObj, installedAddonsDict)
    }
  })
})

// Update download progress listener
ipcMain.on('DLProgress', (e, DLAddon) => {
  if (DLAddon.hasOwnProperty('dlStatus')) {
    console.log('\tDownload Progress for ' + DLAddon.name + ': ' + DLAddon.dlStatus)
    mainWindow.webContents.send('updateAddonDL', DLAddon)
  }
})

// error listener
ipcMain.on('error', (e, errorObj) => {
  console.log('\tSending error message ' + errorObj.error)
  mainWindow.webContents.send('error', errorObj)
})

// uninstall addon listener
ipcMain.on('uninstallAddon', (e, addonObj) => {
  console.log(`Received request to delete ${addonObj.name}`)
  installedAddonsDict = uninstallAddon(addonObj, configObj, installedAddonsDict)
  saveToAddonList(configObj, installedAddonsDict)
  mainWindow.webContents.send('addonList', installedAddonsDict)
  mainWindow.webContents.send('newAddonObj', {
    'displayName': addonObj.displayName,
    'name': addonObj.name,
    'version': addonObj.version,
    'host': addonObj.host,
    'URL': addonObj.URL,
    'authors': addonObj.authors,
    'status': 'NOT INSTALLED'
  })
})

// need to wait for react to finishing building Dom
ipcMain.on('windowDoneLoading', () => {
  mainWindow.webContents.send('addonList', installedAddonsDict)
})
