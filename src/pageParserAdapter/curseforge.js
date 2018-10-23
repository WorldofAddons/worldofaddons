import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'

// Creates a JSON object for addons hosted by Curseforge.
// Parses the addon name from the end of the url, this name is how the
// JSON object is referenced by other components
export function parseUrl (url) {
  const URLSplit = url.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    return { 'url': url, 'host': 'curseforge', 'name': URLSplit[1] }
  }
  return { 'error': `Invalid url ${url}` }
}

// This function goes to the url https://www.curseforge.com/wow/addons/<addon name>/files
// to parse the version number, addon display name, and addon authors
export function parseAddonDetails (url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.open('GET', url + '/files', true)
    req.send(null)
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let html = req.responseText
        let parser = new JSDOM(html)
        let page = parser.window.document
        // Check if url is 404
        if (page.getElementsByClassName('error-page').length !== 0) {
          return reject(new Error('Invalid in curseforge parser.'))
        }

        // Fetches the curseforge addon version
        const version = page.getElementsByClassName('table__content file__name full')[0].innerHTML

        // Fetches the curseforge addon display name
        const displayName = page.getElementsByClassName('name')[0].innerHTML

        // Fetches the owner/author(s)
        const searchAuthors = page.getElementsByClassName('member__name')
        const authors = []
        for (let i = 0; i < searchAuthors.length; i++) {
          authors.push(String(searchAuthors[i].innerHTML).match(/>(.*)</).pop())
        }

        if (!version || !displayName) {
          return reject(new Error('curseforge parser could not parse url.'))
        }

        return resolve({
          'authors': authors,
          'displayName': displayName, // Name as displayed on Curseforge
          'version': version // Addon version
        })
      }
    }

    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: url returned ${req.status} for ${url}`
        console.log(errTxt)
        return reject(new Error(errTxt))
      }
    }
  })
}

// This function fetches the direct download link to the addon hosted by Curseforge
// On successful parse it will return a string containing the url
// This url seems to be unique to the addon version
export function parseDownloadURL (url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', url + '/download', true)
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
        const errTxt = `ERROR: url returned ${req.status} for ${url}`
        console.log(errTxt)
        return reject(new Error(errTxt))
      }
    }
  })
}
