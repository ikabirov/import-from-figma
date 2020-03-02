const fs = require('fs')
const {loadNode, loadNodes} = require('./loader')

/**
 * @param {
 *   italic: (boolean|undefined),
 *   fontWeight: (number|string|undefined),
 *   fontSize: (number|string|undefined),
 *   lineHeightPx: (number|undefined),
 *   fontFamily: (string),
 * } font 
 */
function formatFont(a) {
    const {
        italic,
        fontWeight,
        fontSize,
        lineHeightPx,
        fontFamily,
    } = a
    return [
        italic ? 'italic' : null,
        fontWeight,
        `${fontSize}px/${lineHeightPx}px`,
        `'${fontFamily}'`,
    ]
        .filter(v => v)
        .join(' ')
}

/**
 * @param {Object} styles
 */
async function writeFonts(styles) {
    const textKeys = Object.keys(styles)
        .filter(v => styles[v].styleType == 'TEXT')

    const textNodes = (await loadNodes(textKeys))
        .map(v => v.document)
        .map(v => ({
            name: v.name,
            ...v.style,
        }))

    const content = `:root {
	${textNodes
        .map(node => `--font-${node.name.toLocaleLowerCase().replace(/[ /%()+#,".]+/g, '-')}: ${formatFont(node)};`)
        .join('\n\t')
    }
}`
	fs.writeFileSync('css/_fontVariables.css', content, {
		encoding: 'utf-8'
	})
}

async function writeFontsByPageId(id) {
    const fontsNode = await loadNode(id)
    writeFonts(fontsNode.styles)
}

module.exports = {
    writeFonts,
    writeFontsByPageId,
}