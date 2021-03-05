import { loadRoot } from './loader'
import { writeColors } from './colors'
import { writeFonts } from './fonts'
import { loadIcons } from './icons'
import { clean } from './resource'

async function loadDocument() {
  clean()

  const { data } = await loadRoot()
  const typographyPage = data.document.children.find((page) => page.name === 'Typography')
  const colorsPage = data.document.children.find((page) => page.name === 'Colors')
  const iconsPage = data.document.children.find((page) => page.name === 'Icons')

  if (typographyPage) {
    writeFonts(typographyPage.id)
  }

  if (colorsPage) {
    writeColors(colorsPage.id)
  }

  if (iconsPage) {
    loadIcons(iconsPage.id)
  }
}

loadDocument()
