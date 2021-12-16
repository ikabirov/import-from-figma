export type Config = {
  figmaToken: string
  projectId: string
  exportType: 'react' | 'flutter'
  outputDir: string
  iconsDir?: string
  colorsDir?: string
  typographyDir?: string
  getCssRootSelector?: (theme: string) => string
}
