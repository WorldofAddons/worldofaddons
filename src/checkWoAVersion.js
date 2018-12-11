import { XMLHttpRequest } from 'xmlhttprequest'

export function checkWoAVersion () {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.open('GET', 'https://api.github.com/repos/WorldofAddons/worldofaddons/tags', true) // Use github API to check version
    req.send(null)
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let allReleases = JSON.parse(req.responseText)
        let latestRelease = allReleases[0].name.split('-')
        return resolve(latestRelease)
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
