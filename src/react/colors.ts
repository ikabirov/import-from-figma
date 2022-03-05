import { Color } from 'figma-js'
import { sortByStringField } from './fonts'

import { saveColorTheme } from './resource'

type ColorData = {
  name: string
  color: Color
  opacity: number
}

const OPACITY_PRECISION = 3

function formatHex(rgbValue: number) {
  return rgbValue.toString(16).padStart(2, '0').toLocaleUpperCase()
}

function formatColor(color: Color, opacity: number) {
  const r = Math.round(color.r * 255)
  const g = Math.round(color.g * 255)
  const b = Math.round(color.b * 255)
  const precision = 10 ** OPACITY_PRECISION

  if (typeof opacity == 'number') {
    return `rgba(${r}, ${g}, ${b}, ${Math.round(opacity * precision) / precision})`
  }

  return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`
}

function parseColorName(fullName: string) {
  const name = fullName
    .trim()
    .replace(/[ /%()+#,".-]+/g, '_')
    .replace(/^\d.*/, (name) => `'${name}'`)

  return {
    name: fullName,
  }
}

async function writeColors(colors: ColorData[], getCssRootSelector?: (theme: string) => string) {
  const themes: Record<string, ColorData[]> = {
    dark: [],
    light: [],
  }

  const themeColors: ColorData[] = []

  colors.forEach((color) => {
    const { name } = parseColorName(color.name)

    themeColors.push({
      ...color,
      name,
    })
  })

  const colorsCss = themeColors
    .filter((fill) => {
      if (fill.name.match(/[а-яА-Я]+/)) {
        console.log('incorrect color name: ' + fill.name)
        return false
      }
      return true
    })
    .sort((a, b) => sortByStringField(a, b, 'name'))
    .map((fill) => {
      if (!fill.color) {
        console.log(`unsupported color: ${fill.name}`)
        return ''
      }
      return `'${fill.name}': '${formatColor(fill.color, fill.opacity)}',`
    })
    .join('\n\t')

  const content = `export const Colors = { ${colorsCss} }`

  saveColorTheme('colors', content)
}

export { writeColors }
