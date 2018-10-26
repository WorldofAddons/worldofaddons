// Checks what website hosts the addon
export function checkWhichHost (URL) {
  if (URL.startsWith('https://www.curseforge.com/wow/addons/')) {
    return initCurseforgeObj(URL)
  }

  const errorObj = { 'error': `Invalid URL '${URL}'. Given link does not match parse` }
  return errorObj
}

// Creates a JSON object for addons hosted by Curseforge.
// Parses the addon name from the end of the URL, this name is how the
// JSON object is referenced by other components
function initCurseforgeObj (URL) {
  const URLSplit = URL.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    const URLObj = { 'URL': URL, 'host': 'curseforge', 'name': URLSplit[1] }
    return URLObj
  }
  const errorObj = { 'error': `Invalid URL '${URL}'.` }
  return errorObj
}
