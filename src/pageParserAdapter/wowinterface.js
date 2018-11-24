import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'

export function parseAddonDetails(url) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest()
        req.open('GET', url, true)
        req.send(null)
        req.onreadystatechange = () => {
          if (req.readyState === 4) {
            let html = req.responseText
            let parser = new JSDOM(html)
            let page = parser.window.document
            // Fetches the wowinterface addon version
            const version = page.getElementById('version').innerHTML.replace("Version: ","")

            // Fetches the wowinterface addon display name
            const displayName = page.title.split(":")[0]
    
            // Fetches the owner/author(s)
            const searchAuthors = page.getElementById('author').getElementsByTagName("a")
            const authors = []
            for (let i = 0; i < searchAuthors.length; i++) {
              authors.push(searchAuthors[i].innerHTML.replace("<b>","").replace("</b>",""))
            }

            if (!version || !displayName) {
              return reject(new Error('wowinterface parser could not parse url.'))
            }
            
            return resolve({
              'authors': authors,
              'displayName': displayName, // Name as displayed on wowinterface
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

export function parseDownloadURL(url) {
    return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    url = url.replace('info', 'download')
    req.open('GET', url, true)
    req.send(null)
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let html = req.responseText
        let parser = new JSDOM(html)
        let page = parser.window.document
        const downloadURL = page.getElementsByClassName('manuallink')[0].getElementsByTagName('a')[0].href
        if (!downloadURL) {
          return reject(new Error('wowinterface parser could not parse url.'))
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