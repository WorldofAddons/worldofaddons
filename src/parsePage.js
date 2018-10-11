import { detailsParserBuilder } from './pageParserAdapter/index'

export function parseAddonDetails (URLObj) {
  return new Promise((resolve, reject) => {
    const parseAdapter = detailsParserBuilder(URLObj.host)
    parseAdapter(URLObj.URL).then(result => {
      return resolve({
        'displayName': result.displayName, // Name as displayed on Curseforge
        'name': URLObj.name, // name parsed from URL, this should be used to reference the addon within the code
        'version': result.version, // Addon version
        'host': URLObj.host, // Addon Host (curseforge)
        'URL': URLObj.URL // Curseforge URL
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
