import fs from 'fs'
import os from 'os'
import {initConfig} from '../config'

const NOOP = () => {}

// module mocks
jest.mock('fs')
jest.mock('os')


function mockReadFile(DataObj) {
  const stringData = JSON.stringify(DataObj, 'utf8')
  fs.readFileSync.mockReturnValue(stringData)
}

function mockWriteFile(DataObj) {
  fs.writeFile.mockImplementation(() => { return DataObj })
}

describe('initConfig function', () => {
  beforeAll(() => {
    fs.mkdirSync.mockImplementation(NOOP)
    fs.writeFile.mockImplementation(NOOP)
  })
  describe('WHEN checking a config', () => {
    const homeDir = 'C:/User/home'
    describe('GIVEN no config exists', () =>{
      beforeAll(() => {
        fs.existsSync.mockReturnValue(false)
        os.homedir.mockReturnValue(homeDir)
      })
      it('THEN should return a resolved promise', () => {
          let promise = initConfig()
          return promise.then(result => {
            expect(result.addonDir).toEqual('')
            expect(result.addonRecordFile).toEqual(`${homeDir}/WorldOfAddons/addons.json`)
            expect(result.checkUpdateOnStart).toEqual(false)
          })
      })
    })

    describe('GIVEN a config exists', () => {
      const configMock = {
        addonDir: `${homeDir}/WorldOfAddons`,
        addonRecordFile: `${homeDir}/WorldOfAddons/addons.json`,
        checkUpdateOnStart: true
      }
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true)
        os.homedir.mockReturnValue(homeDir)
        mockReadFile(configMock)
      })
      it('THEN should return a resolved promise', () => {
        let promise = initConfig()
        return promise.then(result => {
          expect(result.addonDir).toEqual(configMock.addonDir)
          expect(result.addonRecordFile).toEqual(configMock.addonRecordFile)
          expect(result.checkUpdateOnStart).toBeTruthy
        })
      })
    })
  })
  
})