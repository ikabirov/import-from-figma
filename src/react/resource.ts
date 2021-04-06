import { writeFileSync, rmdirSync } from 'fs'
import { join } from 'path'
import { mkdir } from 'shelljs'
import { format } from 'prettier'

import { Config } from '../config'

let BASE_FOLDER: string
let FONTS_FOLDER: string
let COLORS_FOLDER: string
let ICONS_FOLDER: string

const BASE_PRETTIER_CONFIG = {
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  semi: false,
} as const

const TS_PRETTIER_CONFIG = {
  ...BASE_PRETTIER_CONFIG,
  parser: 'babel',
}

const CSS_PRETTIER_CONFIG = {
  ...BASE_PRETTIER_CONFIG,
  parser: 'css',
}

function initializeReactResource(config: Config) {
  const { outputDir, iconsDir, colorsDir, typographyDir } = config

  BASE_FOLDER = outputDir
  FONTS_FOLDER = typographyDir
    ? join(BASE_FOLDER, typographyDir)
    : join(BASE_FOLDER, 'css', 'fonts')
  COLORS_FOLDER = colorsDir ? join(BASE_FOLDER, colorsDir) : join(BASE_FOLDER, 'css', 'colors')
  ICONS_FOLDER = iconsDir ? join(BASE_FOLDER, iconsDir) : join(BASE_FOLDER, 'icons')

  rmdirSync(FONTS_FOLDER, { recursive: true })
  rmdirSync(COLORS_FOLDER, { recursive: true })
  rmdirSync(ICONS_FOLDER, { recursive: true })

  mkdir('-p', FONTS_FOLDER)
  mkdir('-p', COLORS_FOLDER)
  mkdir('-p', ICONS_FOLDER)
}

function saveColorTheme(name: string, content: string) {
  const formattedContent = format(content, CSS_PRETTIER_CONFIG)

  writeFileSync(join(COLORS_FOLDER, `${name}.css`), formattedContent, {
    encoding: 'utf-8',
  })
}

function saveFontsCss(content: string) {
  const formattedContent = format(content, CSS_PRETTIER_CONFIG)

  writeFileSync(join(FONTS_FOLDER, 'common.css'), formattedContent, {
    encoding: 'utf-8',
  })
}

function saveIconSvg(name: string, content: string) {
  writeFileSync(join(ICONS_FOLDER, `${name}.svg`), content, {
    encoding: 'utf-8',
  })
}

function saveIconComponent(name: string, content: string) {
  const formattedContent = format(content, TS_PRETTIER_CONFIG)

  writeFileSync(join(ICONS_FOLDER, `${name}.tsx`), formattedContent, {
    encoding: 'utf-8',
  })
}

export { initializeReactResource, saveColorTheme, saveFontsCss, saveIconComponent, saveIconSvg }
