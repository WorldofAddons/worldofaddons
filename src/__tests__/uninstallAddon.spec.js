import {uninstallAddon} from '../uninstallAddon'
import path from 'path'
import fs from 'fs'

describe('uninstallAddon function', () => {
    describe('GIVEN a valid configObj', () => {
        const mockConfig = {
            addonDir: mockInstallDir,
            addonRecordFile: path.join(mockHomeDir, 'WorldOfAddons','addons.json'),
            checkUpdateOnStart: true
        }
        describe('GIVEN a valid installAddonsDict', () => {
            const mockInstallAddonsDict = 
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
                        "subdirOfWow Addon1"
                    ]
                }
            }

            describe('GIVEN a valid addonObj to be uninstalled', () => {
                const mockAddonObj =
                 {
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
                    "subdir0",
                    "subdir1",
                    "subdir2"
                    ]
                }
                
                describe('GIVEN an addon directory exists in the addon install directory', () => {
                    let subDir0Item0 = path.join(mockInstallDir, "subdir0", "foo.txt")
                    let subDir0Item1 = path.join(mockInstallDir, "subdir0", "bar.txt")
                    let subDir1Item0 = path.join(mockInstallDir, "subdir1", "0.txt")
                    let subDir2Item0 = path.join(mockInstallDir, "subdir2", "1.txt")
                    let subdirOfWow_Addon1 = path.join(mockInstallDir, "subdirOfWow Addon1", "addon.txt")
                    const mockFs = {
                        subDir0Item0 : 'foo',
                        subDir0Item1 : 'bar',
                        subDir1Item0 : 'The number zero',
                        subDir2Item0 : 'The number one',
                        subdirOfWow_Addon1 : 'addon content, this should not get deleted'
                    }
                    beforeEach(() => {
                        fs.existsSync.mockReturnValue(true)
                        fs.readdirSync.mockReturnValue(true)
                        mockDirectories(mockFs);
                    })
    
                    it('THEN should delete a-good-wow-addon from the addon dictionary and remove subdir0, subdir1 and subdir2', () => {
                        let newDict = uninstallAddon(mockAddonObj, mockConfig, mockInstallAddonsDict)
                        expect(newDict).toEqual({
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
                                    "subdirOfWow Addon1"
                                ]
                            }
                        })
                    })
                })
                
            })

        })
    })
})