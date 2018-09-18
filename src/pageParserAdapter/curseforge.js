import { JSDOM } from 'jsdom'

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
    return Promise.reject(new Error('Invalid in curseforge parser.'))
  }
  const version = page.getElementsByClassName('table__content file__name full')[0].innerHTML
  const displayName = page.getElementsByClassName('name')[0].innerHTML

  if (!version || !displayName) {
    return Promise.reject(new Error('curseforge parser could not parse url.'))
  }

  return Promise.resolve({
    'displayName': displayName, // Name as displayed on Curseforge
    'version': version // Addon version
  })
}

export function parseDownloadURL (page) {
  const link = page.getElementsByClassName('download__link')[0].href
  const cleanLink = link.substring(link.lastIndexOf('/wow/') + 1, link.lastIndexOf('/file')) + '/file' // Remove "file///<windows drive whatever>" from the link
  const downloadURL = `https://www.curseforge.com/${cleanLink}`

  if (!downloadURL) {
    return Promise.reject(new Error('curseforge parser could not parse url.'))
  }
  return Promise.resolve(downloadURL)
}
