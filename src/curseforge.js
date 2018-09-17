import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'
export function parseDLURLCurseForge (addonObj) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', addonObj.URL + '/download', true)
    req.send(null)

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let pageHTML = req.responseText
        let parser = new JSDOM(pageHTML)
        let page = parser.window.document
        const link = page.getElementsByClassName('download__link')[0].href
        const cleanLink = link.substring(link.lastIndexOf('/wow/') + 1, link.lastIndexOf('/file')) + '/file' // Remove "file///<windows drive whatever>" from the link
        const downloadURL = `https://www.curseforge.com/${cleanLink}`
        console.log(downloadURL)
        return resolve(downloadURL)
      }
    }
    req.onloadend = () => {
      if (req.status !== 200) {
        const errTxt = `ERROR: URL returned ${req.status} for ${URLObj.URL}`
        console.log(errTxt)
        return reject({ 'error': errTxt })
      }
    }
  })
}
