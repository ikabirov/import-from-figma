import { ColorData, Icons, Typography } from '../dsl'

import { writeColors } from './colors'
import { writeFonts } from './fonts'
import { writeIcons } from './icons'

function generateReactArtifacts(
  typographies?: Typography[],
  colors?: ColorData[],
  icons?: Icons,
  getCssRootSelector?: (theme: string) => string
) {
  if (typographies) {
    writeFonts(typographies)
  }

  if (colors) {
    writeColors(colors, getCssRootSelector)
  }

  if (icons) {
    writeIcons(icons)
  }
}

export { generateReactArtifacts }
