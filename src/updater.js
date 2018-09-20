// Runs on application start and after an addon is installed.
// Checks the directory names of the addons directory against the subdirs each addon is supposed
// to have according to the JSON dictionary
// If all match, then set addon status to "Installed"
// If it does not match, then set addon status to "Not installed"
function verifyAddonDict() {
    return
}

// Checks the addon's page for an update by comparing the parsed version value to the
// JSON dictionary value.
// Only runs on addons whose statuses are "Installed"
// If an update is available, then set addon status to "Update Available"
function checkUpdate() {
    return
}