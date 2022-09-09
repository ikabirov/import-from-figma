export type Config = {
  figmaToken: string
  projectId: string
  exportType: 'react' | 'flutter'
  outputDir: string
  iconsDir?: string
  colorsDir?: string
  typographyDir?: string
  skipIcons?: boolean
  getCssRootSelector?: (theme: string) => string
}
