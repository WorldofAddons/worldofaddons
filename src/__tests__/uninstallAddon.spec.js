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
                    // Needs to properly test function uninstallAddon(), this 
                    // requires something like simulating a filesystem in memory
                    beforeEach(() => {
                        fs.existsSync.mockReturnValue(true)
                        fs.readdirSync.mockReturnValue(true)
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