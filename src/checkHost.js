// Checks what website hosts the addon
export function checkWhichHost (url) {
  if (url.startsWith('https://www.curseforge.com/wow/addons/')) {
    return initCurseforgeObj(url)
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
