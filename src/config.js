const fs = require('fs');
const os = require('os');
const path = require('path');

export function initConfig() {
    return new Promise(function(resolve, reject){
        const homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
        const worldOfAddonsDir = path.join(homedir, "WorldOfAddons")    // World of Addons stores information in user's home dir
        const WoAConfig = path.join(worldOfAddonsDir, "config.json")    // Saves all config information in config.json
        let configObj;   // Init configObj
        
        if (!fs.existsSync(worldOfAddonsDir)){
            fs.mkdirSync(worldOfAddonsDir);
        }
        
        // If config.json does not exist, create it with blank values
        if (!fs.existsSync(WoAConfig)){
            configObj = {
                'version': "",          // WoA Client version
                'addonDir': "",         // Path to wow addon folder (init to blank for now)
                'addonRecordFile': ""   // Path to file storing addon records 
            }
            fs.writeFile(WoAConfig, JSON.stringify(configObj), 'utf8')
            return resolve(configObj)
        }
    
        try {
            return resolve(JSON.parse(fs.readFileSync(WoAConfig, 'utf8')))
        }catch (err){
            return reject(err);
        }

    })
}