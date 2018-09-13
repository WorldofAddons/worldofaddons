import curseforge from './curseforge'

/**
 * hostname to function mapping.
 */
const parserMap = {
  'curseforge': curseforge.parseAddonDetails
}

export function pargeParserBuilder (hostname) {
  return parserMap[hostname]
}
