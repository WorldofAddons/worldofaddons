import { XMLHttpRequest } from 'xmlhttprequest'

function parseContributors (getAPIURL) {
    return new Promise((resolve, reject) => {
        const gitContributorURL = getAPIURL.concat("/contributors") // fetches information about latest release from gitAPI
        let req = new XMLHttpRequest()
        req.open('GET', gitContributorURL, true)
        req.send(null)
        req.onreadystatechange = () => {
          if (req.readyState === 4) {
            let jsonResponse = JSON.parse(req.responseText)
            return resolve(["temp"])
            /*
            return resolve({
              'authors': authors,
              'displayName': displayName, // Name as displayed on wowinterface
              'version': version // Addon version
            })*/
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

export function parseAddonDetails (url) {
  return new Promise((resolve, reject) => {
    let parseGITAPI = parseGithubAPI(url)
    let gitAPIURL = parseGITAPI[0]
    let displayName = parseGITAPI[1]
    const gitReleaseURL = gitAPIURL.concat("/releases/latest") // fetches information about latest release from gitAPI
    let req = new XMLHttpRequest()
    req.open('GET', gitReleaseURL, true)
    req.send(null)
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let jsonResponse = JSON.parse(req.responseText)
        //console.log(parseContributors(gitAPIURL))
        return resolve({
          'authors': ["test"],
          'displayName': displayName, // Name as displayed on wowinterface
          'version': jsonResponse.tag_name // Addon version
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

export function parseDownloadURL (url) {
  return new Promise((resolve, reject) => {
    let getAPIURL = parseGithubAPI(url)[0]
    const gitDLURL = getAPIURL.concat("/releases/latest") // fetches information about latest release from gitAPI
    const req = new XMLHttpRequest()
    req.open('GET', gitDLURL, true)
    req.send(null)
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        let jsonResponse = JSON.parse(req.responseText)
        let downloadURL = jsonResponse.assets[0].browser_download_url
        if (!downloadURL) {
          return reject(new Error('github parser could not parse url.'))
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


// The following function creates the github api url for that repo's releases
function parseGithubAPI (url) {
    const URLSplit = url.split('github.com/')
    const nameSplit = URLSplit[1].split("/")
    const name = URLSplit[1]
    const apiURL = "https://api.github.com/repos/".concat(nameSplit[0], "/", nameSplit[1])
    return [apiURL, name]
}