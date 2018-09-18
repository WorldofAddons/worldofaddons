import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'
import { detailsParserBuilder } from './pageParserAdapter/index'

export function checkWhichHost (URL) {
  if (URL.startsWith('https://www.curseforge.com/wow/addons/')) {
    return parseURLCurseforge(URL)
  }
  const errorObj = { 'error': "ERROR: Invalid URL '" + URL + "'. Given link does not match parse" }
  return errorObj
}

// curseforge
export function parseURLCurseforge (URL) {
  const URLSplit = URL.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    const URLObj = { 'URL': URL, 'host': 'curseforge', 'name': URLSplit[1] }
    return URLObj
  }
  const errorObj = { 'error': "ERROR: Invalid URL '" + URL + "'." }
  return errorObj
}

export function parseAddonDetails (URLObj) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.open('GET', URLObj.URL + '/files', true)
    req.send(null)

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const parser = new JSDOM(req.responseText)
        const html = parser.window.document
        const parseAdapter = detailsParserBuilder(URLObj.host)

        parseAdapter(html).then(result => {
          return resolve({
            ...result,
            ...URLObj
          })
        }).catch(err => {
          return reject(err)
        })
      }
    }
    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: URL returned ${req.status} for ${URLObj.URL}`
        console.log(errTxt)
        return reject(new Error(errTxt))
      }
    }
  })
}
