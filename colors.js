const fs = require("fs")
const {loadNode, loadNodes} = require('./loader')

/**
 * @param {number} rgbValue 
 */
function formatHex(rgbValue) {
	return rgbValue
		.toString(16)
		.padStart(2, 0)
		.toLocaleUpperCase()
}

/**
 * @param {{
 *   r: number,
 *   g: number,
 *   b: number,
 * }} color 
 * @param {number} opacity 
 */
function formatColor(color, opacity) {
	const r = Math.round(color.r * 255)
	const g = Math.round(color.g * 255)
	const b = Math.round(color.b * 255)

	if (typeof opacity == 'number')
	{
		return `rgba(${r}, ${g}, ${b}, ${opacity})`
	}

    return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`
}

/**
 * @param {Object} styles
 */
async function writeColors(styles) {
    const fillKeys = Object.keys(styles)
        .filter(v => styles[v].styleType == 'FILL')

    const fillNodes = (await loadNodes(fillKeys))
        .map(v => ({
            name: v.document.name,
            color: v.document.fills[0].color,
            opacity: v.document.fills[0].opacity,
        }))

    const content = `:root {
    ${fillNodes
        .filter(fill => {
            if (fill.name.match(/[а-яА-Я]+/))
            {
                console.log('incorrect color name: ' + fill.name)
                return false
            }
            return true
        })
        .map(fill => `--color-${fill.name.toLocaleLowerCase().replace(/[ /%()+#,".]+/g, '-')}: ${formatColor(fill.color, fill.opacity)};`)
        .join('\n\t')
    }
}`
	fs.writeFileSync('css/_colorVariables.css', content, {
		encoding: 'utf-8'
	})
}

async function writeColorsByPageId(id) {
    const colorsNode = await loadNode(id)
    writeColors(colorsNode.styles)
}

module.exports = {
    writeColors,
    writeColorsByPageId,
}