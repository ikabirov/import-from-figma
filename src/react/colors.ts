import { Color } from 'figma-js'

import { saveColorTheme } from '../resource'

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

async function writeColors(colors: ColorData[]) {
  const themes: Record<string, ColorData[]> = {
    dark: [],
    light: [],
  }

  colors.forEach((color) => {
    const { theme, name } = parseColorName(color.name)

    themes[theme].push({
      ...color,
      name,
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
