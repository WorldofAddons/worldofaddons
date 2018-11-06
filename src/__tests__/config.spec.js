import { initConfig, readAddonList, saveToAddonList } from '../config'
import { mockConfig, mockInstallAddonsDict } from './mock'
import path from 'path'
import fs from 'fs'

describe('initConfig function', () => {
  describe('WHEN checking a config', () => {
    describe('GIVEN no config exists', () => {
      beforeAll(() => {
        fs.existsSync.mockReturnValue(false)
      })
      it('THEN should return a resolved promise', () => {
        let promise = initConfig()
        return promise.then(result => {
          expect(result.addonDir).toEqual('')
          expect(result.addonRecordFile).toEqual(path.join(mockHomeDir, 'WorldOfAddons', 'addons.json'))
          expect(result.checkUpdateOnStart).toEqual(false)
        })
      })
    })

    describe('GIVEN a config exists', () => {
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

describe('readAddonList function ', () => {
  describe('WHEN reading an addon record file (addons.js) ', () => {
    describe('GIVEN a config exists', () => {
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        mockReadFile(mockConfig)
      })

      describe('GIVEN no addon record file exists ', () => {
        beforeAll(() => {
          fs.existsSync.mockReturnValue(false)
        })
        it('THEN should return an empty dictionary', () => {
          let promise = readAddonList(mockConfig)
          return promise.then(result => {
            expect(result).toEqual({})
          })
        })
      })

      describe('GIVEN an addon record file exists and it is not empty', () => {
        beforeAll(() => {
          fs.existsSync.mockReturnValue(true)
          mockReadFile(mockInstallAddonsDict)
        })
        it('THEN should return a full dictionary', () => {
          let promise = readAddonList(mockConfig)
          return promise.then(result => {
            expect(result).toEqual(mockInstallAddonsDict)
          })
        })
      })
    })
  })
})

describe('saveToAddonList function ', () => {
  describe('GIVEN a config exists', () => {
    beforeAll(() => {
      fs.existsSync.mockReturnValue(true)
      mockReadFile(mockConfig)
    })

    describe('GIVEN an addon record file exists and it is empty', () => {
      const mockInstallAddonsDict = ''
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        mockReadFile(mockInstallAddonsDict)
      })

      describe('WHEN saving a new installed Addons dictionary to an addon record file (addons.js) ', () => {
        it('THEN should return the new dictionary', () => {
          let promise = saveToAddonList(mockConfig, mockInstallAddonsDict)
          return promise.then(result => {
            expect(result).toEqual(mockInstallAddonsDict)
          })
        })
      })
    })

    describe('GIVEN an addon record file exists and it is not empty', () => {
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        mockReadFile(mockInstallAddonsDict)
      })

      describe('WHEN saving a new installed Addons dictionary to an addon record file (addons.js) ', () => {
        it('THEN should return the new dictionary', () => {
          let promise = saveToAddonList(mockConfig, mockInstallAddonsDict)
          return promise.then(result => {
            expect(result).toEqual(mockInstallAddonsDict)
          })
        })
      })
    })
  })
  describe('GIVEN a config exists', () => {
    beforeAll(() => {
      fs.existsSync.mockReturnValue(true)
      mockReadFile(mockConfig)
    })
    describe('GIVEN an addon record file does not exist', () => {
      beforeAll(() => {
        fs.existsSync.mockReturnValue(false)
      })

      describe('WHEN saving a new installed Addons dictionary to an addon record file (addons.js) ', () => {
        it('THEN should return the new dictionary', () => {
          let promise = saveToAddonList(mockConfig, mockInstallAddonsDict)
          return promise.then(result => {
            expect(result).toEqual(mockInstallAddonsDict)
          })
        })
      })
    })
  })
})
