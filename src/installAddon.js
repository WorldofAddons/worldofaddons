import fs from 'fs'
import request from 'request-promise'
import decompress from 'decompress'
import { mainWindow } from '../main'
import os from 'os'
import path from 'path'

import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'
import { downloadUrlParserBuilder } from './pageParserAdapter/index'

function downloadUrlParse (addonObj) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', addonObj.URL + '/download', true)
    req.send(null)

    req.onreadystatechange = () => {
      const parser = new JSDOM(req.responseText)
      const html = parser.window.document
      const downloadUrlAdapter = downloadUrlParserBuilder(addonObj.host)

      downloadUrlAdapter(html).then(url => {
        return resolve(url)
      }).catch(err => {
        return reject(err)
      })
    }

    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: URL returned ${req.status} for ${addonObj.URL}`
        console.log(errTxt)
        return reject(new Error(errTxt))
      }
    }
  })
}

// Install the addon by chained-promises
export function installAddon (addonObj, targetPath) {
  return new Promise((resolve, reject) => {
    downloadUrlParse(addonObj) // TODO: addonObj will have a download url.
      .then((curseDownloadURL) => {
        // console.log(path.join(targetPath, addonObj.name + ".zip"))
        return downloadAddon(addonObj, curseDownloadURL)
      })
      .then(() => { // Download the addon using the parsed URL
        return extAddonToDir(addonObj, targetPath) // After download is done extract the zip to target dir and delete the old zip
      })
      .then((finalAddonObj) => {
        console.log(`\t${finalAddonObj.name} Installed.`)
        return resolve(finalAddonObj)
      }).catch(err => {
        return reject(err)
      })
  })
}

export function downloadAddon (addonObj, downloadURL) {
  return new Promise((resolve, reject) => {
    let req = request({
      method: 'GET',
      uri: downloadURL
    })
    const dlDirectory = path.join(os.tmpdir(), addonObj.name + '.zip') // Download .zip to tempdir
    req.pipe(fs.createWriteStream(dlDirectory, { flags: 'w' }))

    let receivedBytes = 0
    let totalBytes = 0
    req.on('response', (data) => {
      totalBytes = parseInt(data.headers['content-length'])
    })

    req.on('data', (chunk) => {
      receivedBytes += chunk.length
      let percentage = parseInt((receivedBytes * 100) / totalBytes)
      const updateObj = { 'name': addonObj.name, 'dlStatus': percentage }
      mainWindow.webContents.send('updateAddonStatus', updateObj)
    })

    req.then((data) => {
      console.log('\tDownload for ' + addonObj.name + ' completed.')
      // send complete message to frontend
      return resolve()
    })
  })
}

// Extracts the addon zip to target dir and delete the old zip, adds subdirs to list in addonObj
export function extAddonToDir (addonObj, targetPath) {
  return new Promise((resolve, reject) => {
    const addonZip = path.join(os.tmpdir(), addonObj.name + '.zip')
    console.log(`\tExtracting ${addonObj.name} from ${addonZip} to dir: ${targetPath}`)

    decompress(addonZip, targetPath, {
      map: file => { return file }
    }).then(files => {
      fs.unlink(addonZip, (err) => {
        if (err) throw err
        console.log(`\tDeleted ${addonZip}`)
      })

      files.forEach((part, index, files) => { // Quick and dirty record all addon dirs
        files[index] = files[index].path.split('/')[0]
      })
      const addonDirs = Array.from(new Set(files))
      addonObj.subdirs = addonDirs
      return resolve(addonObj)
    })
  })
}
