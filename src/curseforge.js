import { XMLHttpRequest } from 'xmlhttprequest'
import { JSDOM } from 'jsdom'
export function parseCurseforgeDlUrl(addonObj) {
    return new Promise(function(resolve, reject){
        const req = new XMLHttpRequest();
        req.open("GET", addonObj.url+"/download", true);
        req.send(null);

        req.onreadystatechange = function() {
            if (req.readyState == 4){
                let pageHTML = req.responseText
                let parser = new JSDOM(pageHTML)
                let page = parser.window.document
                const link = page.getElementsByClassName('download__link')[0].href
                const cleanLink = link.substring(link.lastIndexOf("/wow/") + 1, link.lastIndexOf("/file")) + "/file" // Remove "file///<windows drive whatever>" from the link
                const downloadUrl =  `https://www.curseforge.com/${cleanLink}`
                console.log(downloadUrl)
                return resolve(downloadUrl)
            }
        }
        req.onloadend = () => {
            if(req.status !== 200) {
                const errTxt = `ERROR: URL returned ${req.status} for ${urlObj.url}`
                console.log(errTxt)
                const errorObj = {'error': errTxt}
                return reject(errorObj)
            }
        }
    })
}