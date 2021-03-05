import { writeFileSync, rmdirSync } from 'fs'
import { join } from 'path'
import { mkdir } from 'shelljs'
import { format } from 'prettier'

const BASE_FOLDER = 'generated'
const CSS_FOLDER = join(BASE_FOLDER, 'css')
const FONTS_FOLDER = join(CSS_FOLDER, 'fonts')
const COLORS_FOLDER = join(CSS_FOLDER, 'colors')
const ICONS_FOLDER = join(BASE_FOLDER, 'icons')

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

function clean() {
  rmdirSync(BASE_FOLDER, {
    recursive: true,
  })

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

export { clean, saveColorTheme, saveFontsCss, saveIconComponent, saveIconSvg }
