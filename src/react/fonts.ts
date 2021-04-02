import { Typography } from '../dsl'
import { saveFontsCss } from './resource'


function formatFont(fontNode: Typography) {
  const { italic, fontWeight, fontSize, lineHeightPx, fontFamily } = fontNode
  return [
    italic ? 'italic' : null,
    fontWeight,
    `${fontSize / 16}rem/${lineHeightPx / 16}rem`,
    `'${fontFamily}'`,
  ]
    .filter((v) => v)
    .join(' ')
}

async function writeFonts(typographies: Typography[],) {
  const variablesText = typographies
    .filter((node) => {
      if (node.name.match(/[а-яА-Я]+/)) {
        console.log('incorrect font name: ' + node.name)
        return false
      }
      return true
    })
    .map(
      (node) =>
        `--font-${node.name.toLocaleLowerCase().replace(/[ /%()+#,".]+/g, '-')}: ${formatFont(
          node
        )};`
    )
    .join('\n\t')

  const content = `:root { ${variablesText} }`

  saveFontsCss(content)
}

export { writeFonts }
