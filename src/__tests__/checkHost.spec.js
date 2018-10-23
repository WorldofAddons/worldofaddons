import { checkWhichHost } from '../checkHost'

describe('checkWhichHost function', () => {
  describe('GIVEN a valid url', () => {
    const addonName = 'dank-memes'
    const host = 'curseforge'
    const validURL = `https://www.${host}.com/wow/addons/${addonName}`
    it('THEN should return a valid url object', () => {
      const result = checkWhichHost(validURL)
      expect(result.url).toEqual(validURL)
      expect(result.name).toEqual(addonName)
      expect(result.host).toEqual(host)
    })
  })
  describe('GIVEN an invalid url', () => {
    const invalidUrl = `https://www.KevinIsTheBest.com/wow/addons/JetFuel`
    it('THEN should return a error object', () => {
      const result = checkWhichHost(invalidUrl)
      expect(result).toHaveProperty('error')
    })
  })
})
