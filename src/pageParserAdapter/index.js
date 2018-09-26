import * as curseforge from './curseforge'
import { HOSTNAMES } from '../../constants/index'

/**
 * hostname to function mapping.
 */
const parserMap = {
  [HOSTNAMES.CURSEFORGE]: curseforge.parseAddonDetails
}

export function detailsParserBuilder (hostname) {
  return parserMap[hostname.toUpperCase()]
}

const parserUrlMap = {
  [HOSTNAMES.CURSEFORGE]: curseforge.parseDownloadURL
}

export function downloadUrlParserBuilder (hostname) {
  return parserUrlMap[hostname.toUpperCase()]
}
