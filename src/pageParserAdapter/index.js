import * as curseforge from './curseforge'
import * as wowinterface from './wowinterface'
import * as github from './github'
import { HOSTNAMES } from '../../constants/index'

/**
 * hostname to function mapping.
 */
const parserMap = {
  [HOSTNAMES.CURSEFORGE]: curseforge.parseAddonDetails,
  [HOSTNAMES.WOWINTERFACE]: wowinterface.parseAddonDetails,
  [HOSTNAMES.GITHUB]: github.parseAddonDetails
}

export function detailsParserBuilder (hostname) {
  return parserMap[hostname.toUpperCase()]
}

const parserUrlMap = {
  [HOSTNAMES.CURSEFORGE]: curseforge.parseDownloadURL,
  [HOSTNAMES.WOWINTERFACE]: wowinterface.parseDownloadURL,
  [HOSTNAMES.GITHUB]: github.parseDownloadURL
}

export function downloadUrlParserBuilder (hostname) {
  return parserUrlMap[hostname.toUpperCase()]
}
