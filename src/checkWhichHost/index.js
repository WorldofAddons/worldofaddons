export function checkWhichHost (URL) {
  if (URL.startsWith('https://www.curseforge.com/wow/addons/')) {
    return initCurseforgeObj(URL)
  }

  const errorObj = { 'error': "ERROR: Invalid URL '" + URL + "'. Given link does not match parse" }
  return errorObj
}

function initCurseforgeObj (URL) {
  const URLSplit = URL.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    const URLObj = { 'URL': URL, 'host': 'curseforge', 'name': URLSplit[1] }
    return URLObj
  }
  const errorObj = { 'error': "ERROR: Invalid URL '" + URL + "'." }
  return errorObj
}
