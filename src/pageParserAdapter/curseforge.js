export function parseUrl (url) {
  const URLSplit = URL.split('https://www.curseforge.com/wow/addons/')
  if (URLSplit.length === 2) {
    return { 'URL': url, 'host': 'curseforge', 'name': URLSplit[1] }
  }
  return { 'error': `Invalid URL ${url}` }
}

export function parseAddonDetails (html) {
  const parser = new JSDOM(html)
  const page = parser.window.document

  // Check if URL is 404
  if (page.getElementsByClassName('error-page').length !== 0) {
    return Promise.reject({ 'error': `Invalid in curseforge parser.` })
  }
  const version = page.getElementsByClassName('table__content file__name full')[0].innerHTML
  const displayName = page.getElementsByClassName('name')[0].innerHTML

  if (!version || !displayName) {
    return Promise.reject({ 'error': `curseforge parser could not parse url.` })
  }

  const info = {
    'displayName': displayName, // Name as displayed on Curseforge
    'version': version // Addon version
  }
  return Promise.resolve(info)
}
