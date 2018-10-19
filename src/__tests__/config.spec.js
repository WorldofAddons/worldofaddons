import fs from 'fs'
import {initConfig} from '../config'

describe('initConfig function', () => {
  describe('WHEN checking a config', () => {
    describe('GIVEN no config exists', () =>{
      beforeAll(() => {
        fs.existsSync.mockReturnValue(false)
      })
      it('THEN should return a resolved promise', () => {
          let promise = initConfig()
          return promise.then(result => {
            expect(result.addonDir).toEqual('')
            expect(result.addonRecordFile).toEqual(`${mockHomeDir}/WorldOfAddons/addons.json`)
            expect(result.checkUpdateOnStart).toEqual(false)
          })
      })
    })

    describe('GIVEN a config exists', () => {
      const mockConfig = {
        addonDir: `${mockHomeDir}/WorldOfAddons`,
        addonRecordFile: `${mockHomeDir}/WorldOfAddons/addons.json`,
        checkUpdateOnStart: true
      }
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        mockReadFile(mockConfig)
      })
      it('THEN should return a resolved promise', () => {
        let promise = initConfig()
        return promise.then(result => {
          expect(result.addonDir).toEqual(mockConfig.addonDir)
          expect(result.addonRecordFile).toEqual(mockConfig.addonRecordFile)
          expect(result.checkUpdateOnStart).toBeTruthy
        })
      })
    })
  })
  
})