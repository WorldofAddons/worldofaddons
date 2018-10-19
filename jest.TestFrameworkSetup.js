import fs from 'fs'
import os from 'os'

// module mocks ***************************************/
jest.mock('fs')
jest.mock('os')
/*** **************************************************/

// Useful function mocks ******************************/
function mockReadFile(DataObj) {
  const stringData = JSON.stringify(DataObj, 'utf8')
  fs.readFileSync.mockReturnValue(stringData)
}
function mockWriteFile(DataObj) {
  fs.writeFile.mockImplementation(() => { return DataObj })
}
const NOOP = () => {} // classical no operation function
/*** *************************************************/

// Pre-Mocked modules ********************************/
const mockHomeDir = 'C:/User/home'
os.homedir.mockReturnValue(mockHomeDir)
// fs module - anything that can create things
fs.WriteStream.mockImplementation(NOOP)
fs.mkdir.mockImplementation(NOOP)
fs.mkdirSync.mockImplementation(NOOP)
fs.chmod.mockImplementation(NOOP)
fs.chmodSync.mockImplementation(NOOP)
fs.chown.mockImplementation(NOOP)
fs.chownSync.mockImplementation(NOOP)
fs.write.mockImplementation(NOOP)
fs.writeSync.mockImplementation(NOOP)
fs.writeFile.mockImplementation(NOOP)
fs.writeFileSync.mockImplementation(NOOP)
fs.copyFile.mockImplementation(NOOP)
fs.copyFileSync.mockImplementation(NOOP)
/*** ***********************************************/

// Testing globals *********************************/
global.mockReadFile = mockReadFile
global.mockWriteFile = mockWriteFile
global.NOOP = NOOP
global.mockHomeDir = mockHomeDir
/*** ***********************************************/
