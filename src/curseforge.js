export function parseCurseforgeHTML(pageHTML) {
    var parser = new DOMParser();
    var page = parser.parseFromString(pageHTML, "text/html");
    var link = page.getElementsByClassName('download__link')[0].href
    var cleanLink = link.substring(link.lastIndexOf("/wow/") + 1, link.lastIndexOf("/file")) + "/file" // Remove "file///<windows drive whatever>" from the link
    var downloadUrl =  "https://www.curseforge.com/" + cleanLink
    return downloadUrl
}