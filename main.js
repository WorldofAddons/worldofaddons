// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron'
import { parseAddonDetails } from './src/parsePage'
import { checkWhichHost } from './src/checkWhichHost/index'
import { installAddon } from './src/installAddon'
import { initConfig, initAddonList, saveToAddonList } from './src/config'
import { integrityCheck, checkUpdate } from './src/updater'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

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

// --- Initilization Start---
let configObj // JSON object that holds application config such as location of addon directory and installed addons file
let installedAddonsObj // Dictonary of all installed addons. Reference addons using "name" as key

initConfig()
  .then(value => {
    configObj = value // Sets config settings
    return configObj
  })
  .then(configObj => {
    initAddonList(configObj).then(value => { // Sets installed Addons dictonary
      if (configObj.checkUpdateOnStart === true) {
        Object.keys(value).forEach(function (key) {
          checkUpdate(value[key]).then(resultObj => {
            value[key].status = resultObj.status
            console.log(`\tChecking \t${value[key].displayName}\t${value[key].version}\t${value[key].status}`)
            if (value[key].status === 'UPDATE_AVAIL') {
              saveToAddonList(configObj, value)
            }
          })
        })
      }
      installedAddonsObj = value
      return installedAddonsObj
    })
    .then(value => {
      const chokidar = require('chokidar') // Watches wow Addon folder for changes like new addons or deletions
      const watcher = chokidar.watch(configObj.addonDir, {
        ignored: /(^|[/\\])\../,
        persistent: true,
        depth: 0
      })
      watcher
        .on('addDir', function (path) {
          if (path !== configObj.addonDir) {
            console.log('Addon subdir: ', path)
            integrityCheck(installedAddonsObj, configObj) // Verifies that download was installed
          }
        })
        .on('unlinkDir', function (path) {
          if (path !== configObj.addonDir) {
            console.log('Addon deleted: ', path)
            integrityCheck(installedAddonsObj, configObj) // Verifies that download was uninstalled
          }
        })
        .on('error', function (error) {
          console.log('ERROR: ', error)
        })
        .on('raw', function (event, path, details) {
          console.log('Raw event:', event, path, details)
        })
    })
  })
//  --- Initilization End---

const { ipcMain } = require('electron')

// newURL listener
ipcMain.on('newURL', (e, newURL) => {
  console.log('Recieved new URL ' + newURL)
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
  console.log('Recieved request to install addon ' + addonObj.name)
  installAddon(addonObj, configObj.addonDir)
    .then((newAddon) => {
      installedAddonsObj[newAddon.name] = newAddon
      saveToAddonList(configObj, installedAddonsObj)
      integrityCheck(installedAddonsObj, configObj)
    })
})

// updateAddon() listener
ipcMain.on('checkAddonUpdate', (e, addonObj) => {
  console.log('Recived request to check addon for updates')
  checkUpdate(addonObj).then(resultObj => {
    installedAddonsObj[addonObj].version = resultObj.version
    installedAddonsObj[addonObj].version = resultObj.status
    saveToAddonList(configObj, installedAddonsObj)
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

// need to wait for react to finishing building Dom
ipcMain.on('windowDoneLoading', () => {
  mainWindow.webContents.send('addonList',installedAddonsObj)
})