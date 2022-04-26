import { Typography } from '../dsl'
import { saveFontsCss } from './resource'

const fontWeightReloads: Record<string, number> = {
  'Inter-SemiBold': 600,
}

function formatFont(fontNode: Typography) {
  let { italic, fontWeight, fontSize, lineHeightPx, fontFamily, fontPostScriptName } = fontNode

  return `{
    fontFamily: '${fontFamily}',
    fontSize: ${fontSize},
    fontWeight: '${fontWeightReloads[fontPostScriptName] || fontWeight}',
    lineHeight: ${lineHeightPx},
    fontStyle: '${italic ? 'italic' : 'normal'}'
  },`
}

export function sortByStringField<P extends string>(
  a: Record<P, string>,
  b: Record<P, string>,
  field: P
) {
  const val1 = a[field].toLocaleLowerCase()
  const val2 = b[field].toLocaleLowerCase()

  if (val1 === val2) {
    return 0
  }

  return val1 > val2 ? 1 : -1
}

async function writeFonts(typographies: Typography[]) {
  const variablesText = typographies
    .filter((node) => {
      if (node.name.match(/[а-яА-Я]+/)) {
        console.log('incorrect font name: ' + node.name)
        return false
      }
      return true
    })
    .sort((a, b) => sortByStringField(a, b, 'name'))
    .map((node) => `'${node.name}': ${formatFont(node)}`)
    .join('\n\t')

  const content = `
import { StyleSheet } from 'react-native'; 

export const fontStyles = StyleSheet.create({
${variablesText} 
});`

  saveFontsCss(content)
}

export { writeFonts }
