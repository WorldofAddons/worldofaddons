import curseforge from './curseforge'
import { HOSTNAMES } from '../../constants/index'

/**
 * hostname to function mapping.
 */
const parserMap = {
  [HOSTNAMES.CURSEFORGE]: curseforge.parseAddonDetails
}

export function parseParserBuilder (hostname) {
  return parserMap[hostname.toUpperCase()]
}
