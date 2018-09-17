import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'

export function checkWhichHost (URL) {
  if (URL.startsWith('https://www.curseforge.com/wow/addons/')) {
    return parseURL_curseforge(URL)
  }
  const errorObj = { 'error': "ERROR: Invalid URL '" + URL + "'. Given link does not match parse" }
  return errorObj
}

// curseforge
export function parseURL_curseforge (URL) {
  const URLSplit = URL.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    const URLObj = { 'URL': URL, 'host': 'curseforge', 'name': URLSplit[1] }
    return URLObj
  }
  const errorObj = { 'error': "ERROR: Invalid URL '" + URL + "'." }
  return errorObj
}

export function parseAddonDetailsCurseForge (URLObj) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.open('GET', URLObj.URL + '/files', true)
    req.send(null)

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let pageHTML = req.responseText
        let parser = new JSDOM(pageHTML)
        let page = parser.window.document

        // Check if URL is 404
        if (page.getElementsByClassName('error-page').length != 0) {
          const errorObj = { 'error': `ERROR: Invalid URL 404 ${URLObj.URL}` }
          return reject(errorObj)
        }
        const version = page.getElementsByClassName('table__content file__name full')[0].innerHTML
        const displayName = page.getElementsByClassName('name')[0].innerHTML
        const addonObj = {
          'displayName': displayName, // Name as displayed on Curseforge
          'name': URLObj.name, // name parsed from URL, this should be used to reference the addon within the code
          'version': version, // Addon version
          'host': URLObj.host, // Addon Host (curseforge)
          'URL': URLObj.URL // Curseforge URL
        }
        // console.log(addonObj)
        return resolve(addonObj)
      }
    }
    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: URL returned ${req.status} for ${URLObj.URL}`
        console.log(errTxt)
        const errorObj = { 'error': errTxt }
        return reject(errorObj)
      }
    }
  })
}
