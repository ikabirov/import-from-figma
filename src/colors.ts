import { loadNode, loadNodes } from './loader'
import { writeFileSync } from 'fs'
import { Color, Rectangle } from 'figma-js'
import { saveColorTheme } from './resource'

type ColorData = {
  name: string
  color: Color
  opacity: number
}

const OPACITY_PRECITION = 3

function formatHex(rgbValue: number) {
  return rgbValue.toString(16).padStart(2, '0').toLocaleUpperCase()
}

function formatColor(color: Color, opacity: number) {
  const r = Math.round(color.r * 255)
  const g = Math.round(color.g * 255)
  const b = Math.round(color.b * 255)
  const precition = 10 ** OPACITY_PRECITION

  if (typeof opacity == 'number') {
    return `rgba(${r}, ${g}, ${b}, ${Math.round(opacity * precition) / precition})`
  }

  return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`
}

function parseColorName(fullName: string) {
  const themeSeparatorIndex = fullName.indexOf('/')
  const theme = fullName.slice(0, themeSeparatorIndex).trim().toLocaleLowerCase()
  const name = fullName
    .slice(themeSeparatorIndex + 1)
    .trim()
    .toLocaleLowerCase()
    .replace(/[ /%()+#,".]+/g, '-')

  return {
    theme,
    name,
  }
}

async function writeColors(pageId: string) {
  const node = await loadNode(pageId)

  if (!node?.styles) {
    return
  }

  const { styles } = node
  const fillKeys = Object.keys(styles).filter((v) => styles[v].styleType == 'FILL')

  const themes: Record<string, ColorData[]> = {
    dark: [],
    light: [],
  }

  const nodes = await loadNodes(fillKeys)
  nodes
    .map((node) => node?.document as Rectangle)
    .forEach((v) => {
      const { theme, name } = parseColorName(v.name)

      themes[theme].push({
        name,
        color: v.fills[0].color!,
        opacity: v.fills[0].opacity!,
      })
    })

  for (const theme of Object.keys(themes)) {
    const colorsCss = themes[theme]
      .filter((fill) => {
        if (fill.name.match(/[а-яА-Я]+/)) {
          console.log('incorrect color name: ' + fill.name)
          return false
        }
        return true
      })
      .map((fill) => `--color-${fill.name}: ${formatColor(fill.color, fill.opacity)};`)
      .join('\n\t')

    const content = `:root { ${colorsCss} }`

    saveColorTheme(theme, content)
  }
}

export { writeColors }
