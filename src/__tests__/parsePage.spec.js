import { parseAddonDetails } from '../parsePage'

describe('parseAddonDetails function', () => {
  describe('WHEN making a REAL request to curseforge.com', () => {
    describe('WHEN using a real URLObj for DBM hosted on Curseforge', () => { // TODO: Sometimes request fails, need to mock websocket and website
      it('THEN should return a valid addonObj', () => {
        const validURLObj = { 'url': 'https://www.curseforge.com/wow/addons/deadly-boss-mods', 'host': 'curseforge', 'name': 'deadly-boss-mods' }
        let promise = parseAddonDetails(validURLObj)
        return promise.then(result => {
          expect(result.displayName).toEqual('Deadly Boss Mods (DBM)')
          expect(result.name).toEqual('deadly-boss-mods')
          expect(result.version).not.toBeNull()
          expect(result.host).toEqual('curseforge')
          expect(result.url).toEqual('https://www.curseforge.com/wow/addons/deadly-boss-mods')
          expect(result.authors).toEqual(['mysticalos', 'Tandanu', 'DBM_Build', 'Elnarfim', 'Mini_Dragon', 'Arta88', 'Mave99', 'nbluewiz', 'oscarucb', 'TOM_RUS', 'SmoothMcGroove'])
          expect(result.status).toEqual('')
        })
      })
    })
    describe('WHEN using an invalid test URLObj', () => {
      it('THEN should return an error', () => {
        const invalidURLObj = { 'url': 'https://www.curseforge.com/wow/addons/test-addon', 'host': 'curseforge', 'name': 'test-addon' }
        let promise = parseAddonDetails(invalidURLObj)
        expect(promise).rejects.toThrow('Invalid URL.')
      })
    })
  })
})
