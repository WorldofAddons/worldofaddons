import {initConfig, readAddonList, saveToAddonList} from '../config'
import path from 'path'
import fs from 'fs'

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
            expect(result.addonRecordFile).toEqual(path.join(mockHomeDir, 'WorldOfAddons','addons.json'))
            expect(result.checkUpdateOnStart).toEqual(false)
          })
      })
    })

    describe('GIVEN a config exists', () => {
      const mockConfig = {
        addonDir: mockInstallDir,
        addonRecordFile: path.join(mockHomeDir, 'WorldOfAddons','addons.json'),
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

describe('readAddonList function ', () => {
  describe('WHEN reading an addon record file (addons.js) ', () => {
    describe('GIVEN a config exists', () => {
      const mockConfig = {
        addonDir: mockInstallDir,
        addonRecordFile: path.join(mockHomeDir, 'WorldOfAddons','addons.json'),
        checkUpdateOnStart: true
      }
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
        const mockAddonRecordFile = 
        {
          "a-good-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/a-good-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon",
            "host": "curseforge",
            "name": "a-good-wow-addon",
            "status": "INSTALLED",
            "version": "1.0.0",
            "subdirs": [
              "subdir1",
              "subdir2",
              "subdir3"
            ]
          }
        }
        beforeAll(() => {
          fs.existsSync.mockReturnValue(true)
          mockReadFile(mockAddonRecordFile)
        })
        it('THEN should return a full dictionary', () => {
          let promise = readAddonList(mockConfig)
          return promise.then(result => { 
            expect(result).toEqual(mockAddonRecordFile)
          })
        })
      })
    })
  })
})

describe('saveToAddonList function ', () => {
  describe('GIVEN a config exists', () => {
    const mockConfig = {
      addonDir: mockInstallDir,
      addonRecordFile: path.join(mockHomeDir, 'WorldOfAddons','addons.json'),
      checkUpdateOnStart: true
    }
    beforeAll(() => {
      fs.existsSync.mockReturnValue(true)
      mockReadFile(mockConfig)
    })

    describe('GIVEN an addon record file exists and it is empty', () => {
      const mockAddonRecordFile = ""
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        mockReadFile(mockAddonRecordFile)
      })
    
      describe('WHEN saving a new installed Addons dictionary to an addon record file (addons.js) ', () => {
        const newAddonDict = 
        {
          "a-good-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/a-good-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon0",
            "host": "curseforge",
            "name": "a-good-wow-addon",
            "status": "INSTALLED",
            "version": "1.0.0",
            "subdirs": [
              "subdir1",
              "subdir2",
              "subdir3"
            ]
          },
          "another-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/another-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon1",
            "host": "curseforge",
            "name": "another-wow-addon",
            "status": "INSTALLED",
            "version": "999",
            "subdirs": [
              "subdir1"
            ]
          }
        }
        it('THEN should return the new dictionary', () => {
          let promise = saveToAddonList(mockConfig, newAddonDict)
          return promise.then(result => { 
            expect(result).toEqual(newAddonDict)
          })
        })
      })
    })

    describe('GIVEN an addon record file exists and it is not empty', () => {
      const mockAddonRecordFile = 
      {
        "a-good-wow-addon": {
          "URL": "https://www.curseforge.com/wow/addons/a-good-wow-addon",
          "authors": [
            "you-Are-Now-Breathing-Manually"
          ],
          "displayName": "Wow Addon",
          "host": "curseforge",
          "name": "a-good-wow-addon",
          "status": "INSTALLED",
          "version": "1.0.0",
          "subdirs": [
            "subdir1",
            "subdir2",
            "subdir3"
          ]
        }
      }
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        mockReadFile(mockAddonRecordFile)
      })
    
      describe('WHEN saving a new installed Addons dictionary to an addon record file (addons.js) ', () => {
        const newAddonDict = 
        {
          "a-good-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/a-good-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon0",
            "host": "curseforge",
            "name": "a-good-wow-addon",
            "status": "INSTALLED",
            "version": "1.0.0",
            "subdirs": [
              "subdir1",
              "subdir2",
              "subdir3"
            ]
          },
          "another-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/another-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon1",
            "host": "curseforge",
            "name": "another-wow-addon",
            "status": "INSTALLED",
            "version": "999",
            "subdirs": [
              "subdir1"
            ]
          }
        }
        it('THEN should return the new dictionary', () => {
          let promise = saveToAddonList(mockConfig, newAddonDict)
          return promise.then(result => { 
            expect(result).toEqual(newAddonDict)
          })
        })
      })
    })
  })
  describe('GIVEN a config exists', () => {
    const mockConfig = {
      addonDir: mockInstallDir,
      addonRecordFile: path.join(mockHomeDir, 'WorldOfAddons','addons.json'),
      checkUpdateOnStart: true
    }
    beforeAll(() => {
      fs.existsSync.mockReturnValue(true)
      mockReadFile(mockConfig)
    })
    describe('GIVEN an addon record file does not exist', () => {
      beforeAll(() => {
        fs.existsSync.mockReturnValue(false)
      })
    
      describe('WHEN saving a new installed Addons dictionary to an addon record file (addons.js) ', () => {
        const newAddonDict = 
        {
          "a-good-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/a-good-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon0",
            "host": "curseforge",
            "name": "a-good-wow-addon",
            "status": "INSTALLED",
            "version": "1.0.0",
            "subdirs": [
              "subdir1",
              "subdir2",
              "subdir3"
            ]
          },
          "another-wow-addon": {
            "URL": "https://www.curseforge.com/wow/addons/another-wow-addon",
            "authors": [
              "you-Are-Now-Breathing-Manually"
            ],
            "displayName": "Wow Addon1",
            "host": "curseforge",
            "name": "another-wow-addon",
            "status": "INSTALLED",
            "version": "999",
            "subdirs": [
              "subdir1"
            ]
          }
        }
        it('THEN should return the new dictionary', () => {
          let promise = saveToAddonList(mockConfig, newAddonDict)
          return promise.then(result => { 
            expect(result).toEqual(newAddonDict)
          })
        })
      })
    })
  })
})