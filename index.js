const {loadRoot} = require('./loader')
const {writeColors, writeColorsByPageId} = require('./colors')
const {writeFonts, writeFontsByPageId} = require('./fonts')
const {loadIcons} = require('./icons')



async function loadDocument() {
    const json = await loadRoot()
    const styles = json.styles

	// writeColors(styles)
	writeColorsByPageId('180:0') // Colors
	// writeFonts(styles)
	writeFontsByPageId('180:1') // Title and texts

	loadIcons('65:812') // Icons & Illustrations -> Icons
	loadIcons('2460:1') // Icons & Illustrations -> Illustrations
}

loadDocument()
