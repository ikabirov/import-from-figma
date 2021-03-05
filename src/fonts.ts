import { loadNodes, loadNode } from './loader'
import { TypeStyle, Text } from 'figma-js'
import { saveFontsCss } from './resource'

function formatFont(fontNode: TypeStyle) {
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

async function writeFonts(pageId: string) {
  const node = await loadNode(pageId)

  if (!node?.styles) {
    return
  }

  const { styles } = node
  const textKeys = Object.keys(styles).filter((v) => styles[v].styleType == 'TEXT')

  const textNodes = (await loadNodes(textKeys))
    .map((v) => v!.document)
    .map((v) => ({
      name: v.name,
      ...(v as Text).style,
    }))

  const variablesText = textNodes
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
