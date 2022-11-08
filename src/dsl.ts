import fetch from 'node-fetch'
import { Color, FileResponse, TypeStyle, Text, Rectangle } from 'figma-js'
import { loadNode, loadNodes, loadSvgUrls } from './loader'
import { Config } from './config'

const QUEUE_SIZE = 4

type Typography = Pick<
  TypeStyle,
  'italic' | 'fontWeight' | 'fontSize' | 'lineHeightPx' | 'fontFamily' | 'fontPostScriptName'
> & { name: string }

type ColorData = {
  name: string
  color: Color
  opacity: number
}

type IconName = string
type IconSVGContent = string

type Icons = Record<IconName, IconSVGContent>

async function generateDSL(rawData: FileResponse, config: Config) {
  const { typographyNodeId, colorsNodeId, iconsNodeId } = config.getNodesForExport(rawData.document)

  return {
    typography: typographyNodeId ? await parseTypography(typographyNodeId) : undefined,
    colors: colorsNodeId ? await parseColors(colorsNodeId) : undefined,
    icons: iconsNodeId ? await parseIcons(iconsNodeId) : undefined,
  }
}

async function parseTypography(pageId: string): Promise<Typography[] | undefined> {
  const node = await loadNode(pageId)

  if (!node?.styles) {
    return
  }

  const { styles } = node
  const textKeys = Object.keys(styles).filter((v) => styles[v].styleType == 'TEXT')

  if (!textKeys.length) {
    return []
  }

  const textNodes: Typography[] = (await loadNodes(textKeys))
    .map((v) => v!.document)
    .map((v) => ({
      name: v.name,
      ...(v as Text).style,
    }))

  return textNodes
}

async function parseColors(pageId: string): Promise<ColorData[] | undefined> {
  const node = await loadNode(pageId)

  if (!node?.styles) {
    return
  }

  const { styles } = node
  const fillKeys = Object.keys(styles).filter((v) => styles[v].styleType == 'FILL')

  const nodes = await loadNodes(fillKeys)

  const colors: ColorData[] = nodes
    .map((node) => node?.document as Rectangle)
    .map((node) => ({
      name: node.name,
      color: node.fills[0].color!,
      opacity: node.fills[0].opacity!,
    }))

  return colors
}

async function parseIcons(pageId: string): Promise<Icons | undefined> {
  const node = await loadNode(pageId)

  if (!node?.components) {
    return
  }

  const { components } = node
  const ids = Object.keys(components)

  const images = await loadSvgUrls(ids)

  const icons: Icons = {}

  const queue: Promise<unknown>[] = []

  let completed = 0

  for (const id of ids) {
    const iconUrl = images[id]
    const saveIconPromise = fetch(iconUrl)
      .then((res) => res.text())
      .then((iconText) => (icons[components[id].name] = iconText))
      .catch((e) => console.log(e))

    if (queue.length === 0) {
      console.log(`fetch icons progress: ${((completed / ids.length) * 100).toFixed(2)}%`)
    }

    queue.push(saveIconPromise)

    if (queue.length === QUEUE_SIZE) {
      await Promise.all(queue)
      queue.length = 0
      completed += QUEUE_SIZE
    }
  }

  await Promise.all(queue)

  console.log(`fetch icons progress: 100%`)

  return icons
}

export { generateDSL, Typography, ColorData, Icons }
