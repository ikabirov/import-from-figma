const fs = require('fs')
const iconsFolder = './icons/'
fs.readdirSync(iconsFolder)
    .filter(f => f.endsWith('.js'))
    .map(f => fs.unlinkSync(iconsFolder + f))
