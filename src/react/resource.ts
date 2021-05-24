import { writeFileSync, rmdirSync } from 'fs'
import { join, dirname } from 'path'
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
}

function writeFile(path: string, content: string) {
  mkdir('-p', dirname(path))

  writeFileSync(path, content, {
    encoding: 'utf-8',
  })
}

function saveColorTheme(name: string, content: string) {
  const formattedContent = format(content, CSS_PRETTIER_CONFIG)

  writeFile(join(COLORS_FOLDER, `${name}.css`), formattedContent)
}

function saveFontsCss(content: string) {
  const formattedContent = format(content, CSS_PRETTIER_CONFIG)

  writeFile(join(FONTS_FOLDER, 'common.css'), formattedContent)
}

function saveIconSvg(path: string, content: string) {
  writeFile(join(ICONS_FOLDER, path), content)
}

function saveIconComponent(name: string, content: string) {
  const formattedContent = format(content, TS_PRETTIER_CONFIG)

  writeFile(join(ICONS_FOLDER, `${name}.tsx`), formattedContent)
}

export { initializeReactResource, saveColorTheme, saveFontsCss, saveIconComponent, saveIconSvg }
