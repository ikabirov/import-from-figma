const fs = require('fs')
const fetch = require('node-fetch')
const {loadNode, loadSvg} = require('./loader')

async function loadIcons(id) {
    const iconsPage = await loadNode(id)
    const components = iconsPage.components
    const ids = Object.keys(components)

    const svgUrls = await loadSvg(ids.join(','))

    const icons = []
    for (const id of ids)
    {
        const iconUrl = svgUrls.images[id]
        const iconInfo = fetch(iconUrl)
            .then(res => res.text())
            .then(iconText => ({
                name: components[id].name,
                text: iconText,
            }))
        icons.push(iconInfo)
    }

    const iconsData = await(Promise.all(icons))
    let i = 0
    for (const icon of iconsData) 
    {
        const filename = icon.name.replace(/\//g, '-') + '.svg'
        fs.writeFileSync(`icons/${filename}`, icon.text, {
            encoding: 'utf-8'
        })    
    }
}

module.exports = {
    loadIcons,
}