export function parseCurseforgeHTML(pageHTML) {
    const parser = new DOMParser();
    const page = parser.parseFromString(pageHTML, "text/html");
    const link = page.getElementsByClassName('download__link')[0].href
    const cleanLink = link.substring(link.lastIndexOf("/wow/") + 1, link.lastIndexOf("/file")) + "/file" // Remove "file///<windows drive whatever>" from the link
    const downloadUrl =  `https://www.curseforge.com/${cleanLink}`

    return downloadUrl
}