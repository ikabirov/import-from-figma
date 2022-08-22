import { Color } from 'figma-js'

import { saveColorTheme, saveTailwindColors } from './resource'

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
    .toLocaleLowerCase()
    .replace(/[ /%()+&#,".:]+/g, '-')
    .replace(/-+/g, '-')

  return {
    theme: 'default',
    name,
  }
}

async function writeColors(colors: ColorData[], getCssRootSelector?: (theme: string) => string) {
  const data: ColorData[] = []
  colors.forEach((color) => {
    const { theme, name } = parseColorName(color.name)

    data.push({
      ...color,
      name,
    })
  })

  const tailwindColors: Record<string, string> = {}

  const colorsCss = data
    .filter((fill) => {
      if (fill.name.match(/[а-яА-Я]+/)) {
        console.log('incorrect color name: ' + fill.name)
        return false
      }
      return true
    })
    .map((fill) => {
      if (!fill.color) {
        console.log(`unsupported color: ${fill.name}`)
        return ''
      }

      const colorName = `--color-${fill.name}`
      tailwindColors[fill.name] = `var(${colorName})`
      return `${colorName}: ${formatColor(fill.color, fill.opacity)};`
    })
    .join('\n\t')

  const content = `:root { ${colorsCss} }`

  saveColorTheme('colors', content)

  saveTailwindColors(`module.exports = ${JSON.stringify(tailwindColors)}`)
}

export { writeColors }
