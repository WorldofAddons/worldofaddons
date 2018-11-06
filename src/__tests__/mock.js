import path from 'path'

export const mockConfig = {
  addonDir: mockInstallDir,
  addonRecordFile: path.join(mockHomeDir, 'WorldOfAddons', 'addons.json'),
  checkUpdateOnStart: true
}

export const mockAddonObj = {
  'URL': 'https://www.curseforge.com/wow/addons/a-good-wow-addon',
  'authors': [
    'you-Are-Now-Breathing-Manually'
  ],
  'displayName': 'Wow Addon',
  'host': 'curseforge',
  'name': 'a-good-wow-addon',
  'status': 'INSTALLED',
  'version': '1.0.0',
  'subdirs': [
    'subdir0',
    'subdir1',
    'subdir2'
  ]
}

export const mockInstallAddonsDict = {
  'a-good-wow-addon': {
    'URL': 'https://www.curseforge.com/wow/addons/a-good-wow-addon',
    'authors': [
      'you-Are-Now-Breathing-Manually'
    ],
    'displayName': 'Wow Addon0',
    'host': 'curseforge',
    'name': 'a-good-wow-addon',
    'status': 'INSTALLED',
    'version': '1.0.0',
    'subdirs': [
      'subdir1',
      'subdir2',
      'subdir3'
    ]
  },
  'another-wow-addon': {
    'URL': 'https://www.curseforge.com/wow/addons/another-wow-addon',
    'authors': [
      'you-Are-Now-Breathing-Manually'
    ],
    'displayName': 'Wow Addon1',
    'host': 'curseforge',
    'name': 'another-wow-addon',
    'status': 'INSTALLED',
    'version': '999',
    'subdirs': [
      'subdirOfWow Addon1'
    ]
  }
}
