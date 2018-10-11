import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'

export function parseUrl (url) {
  const URLSplit = URL.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    return { 'URL': url, 'host': 'curseforge', 'name': URLSplit[1] }
  }
  return { 'error': `Invalid URL ${url}` }
}

export function parseAddonDetails (URL) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.open('GET', URL + '/files', true)
    req.send(null)
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let html = req.responseText
        let parser = new JSDOM(html)
        let page = parser.window.document
        // Check if URL is 404
        if (page.getElementsByClassName('error-page').length !== 0) {
          return reject(new Error('Invalid in curseforge parser.'))
        }
        const version = page.getElementsByClassName('table__content file__name full')[0].innerHTML
        const displayName = page.getElementsByClassName('name')[0].innerHTML

        if (!version || !displayName) {
          return reject(new Error('curseforge parser could not parse url.'))
        }

        return resolve({
          'displayName': displayName, // Name as displayed on Curseforge
          'version': version // Addon version
        })
      }
    }

    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: URL returned ${req.status} for ${URL}`
        console.log(errTxt)
        return reject(new Error(errTxt))
      }
    }
  })
}

export function parseDownloadURL (URL) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', URL + '/download', true)
    req.send(null)

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let html = req.responseText
        let parser = new JSDOM(html)
        let page = parser.window.document
        const link = page.getElementsByClassName('download__link')[0].href
        const cleanLink = link.substring(link.lastIndexOf('/wow/') + 1, link.lastIndexOf('/file')) + '/file' // Remove "file///<windows drive whatever>" from the link
        const downloadURL = `https://www.curseforge.com/${cleanLink}`

        if (!downloadURL) {
          return reject(new Error('curseforge parser could not parse url.'))
        }
        return resolve(downloadURL)
      }
    }

    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: URL returned ${req.status} for ${URL}`
        console.log(errTxt)
        return reject(new Error(errTxt))
      }
    }
  })
}
