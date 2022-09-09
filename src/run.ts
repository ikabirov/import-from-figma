import * as dotenv from 'dotenv'
import { importFromFigma } from './importFromFigma'

dotenv.config()

importFromFigma({
  figmaToken: process.env.FIGMA_TOKEN!,
  projectId: process.env.DOCUMENT_ID!,
  exportType: 'react',
  outputDir: './generated',
  getCssRootSelector: (theme) => `[data-theme='${theme}']`,
  skipIcons: process.env.SKIP_ICONS == '1',
})
