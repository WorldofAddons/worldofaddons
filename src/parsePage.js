import { detailsParserBuilder } from './pageParserAdapter/index'
import { parse } from 'path';

// Generic function that fetches the parser specific to the Addon's host
// On successful parse, returns a JSON object. This object is used by the
// front-end to show the "install" option to the user
export function parseAddonDetails (URLObj) {
  return new Promise((resolve, reject) => {
    const parseAdapter = detailsParserBuilder(URLObj.host)
    parseAdapter(URLObj.url).then(result => {
      return resolve({
        'displayName': result.displayName, // Addon name as displayed on the host website
        'name': URLObj.name, // Addon name parsed from url, this should be used to reference the addon within the code
        'version': result.version, // Addon version
        'host': URLObj.host, // Addon Host
        'url': URLObj.url, // Addon url
        'authors': Array.from(new Set(result.authors)), // Addon Authors
        'status': ''
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
