import { checkWhichHost } from '../index'

describe('checkWhichHost function', () => {
  describe('GIVEN a valid url', () => {
    const addonName = 'dank-memes'
    const host = 'curseforge'
    const validURL = `https://www.${host}.com/wow/addons/${addonName}`
    it('THEN should init a valid URL object', () => {
      const result = checkWhichHost(validURL)
      expect(result.URL).toEqual(validURL)
      expect(result.name).toEqual(addonName)
      expect(result.host).toEqual(host)
    })
  })
})
