// Checks what website hosts the addon
export function checkWhichHost (url) {
  if (url.startsWith('https://www.curseforge.com/wow/addons/')) {
    return initCurseforgeObj(url)
  }

  if (url.startsWith('https://www.wowinterface.com/downloads/info')) {
    return initWoWInterface(url)
  }

  if (url.startsWith('https://www.github.com/') || url.startsWith('https://github.com/')){
    return initGithub(url)
  }

  const errorObj = { 'error': `Invalid url '${url}'. Given link does not match parse` }
  return errorObj
}

// Creates a JSON object for addons hosted by Curseforge.
// Parses the addon name from the end of the url, this name is how the
// JSON object is referenced by other components
function initCurseforgeObj (url) {
  const URLSplit = url.split('https://www.curseforge.com/wow/addons/')
  const URLObj = { 'url': url, 'host': 'curseforge', 'name': URLSplit[1] }
  return URLObj
}

// Creates a JSON object for addons hosted by WoWInterface.
// Parses the addon name from the end of the url, this name is how the
// JSON object is referenced by other components
function initWoWInterface (url) {
  const URLSplit = url.split('https://www.wowinterface.com/downloads/')
  const URLObj = { 'url': url,
    'host': 'wowinterface',
    'name': URLSplit[1].substring(
      URLSplit[1].lastIndexOf('-') + 1,
      URLSplit[1].lastIndexOf('.html')
    ) }
  return URLObj
}

// Creates a JSON object for addons hosted by Github.
// Parses the addon name from the end of the url, this name is how the
// JSON object is referenced by other components

function initGithub (url) {
  const URLSplit = url.split('github.com/')
  const nameSplit = URLSplit[1].split("/")
  console.log(nameSplit)
  if (nameSplit.length >= 2) {
    const URLObj = { 'url': url,
    'host': 'github',
    'name': nameSplit[1]
    }
    return URLObj
  }
}
