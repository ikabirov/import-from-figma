import fetch from 'node-fetch'
import { loadNode, loadSvgUrls } from './loader'
import { saveIconSvg, saveIconComponent } from './resource'

const QUEUE_SIZE = 4
const currentColor = 'black'
const currentColorRegexp = new RegExp(currentColor, 'g')

const namesMap: Record<string, string> = {}

function formatComponentName(name: string) {
  const words = name
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .split(' ')

  return words.map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1)).join('')
}

function saveIcon(name: string, text: string) {
  if (!text) {
    console.log(`incorrect icon: ${name}`)
    return
  }

  const componentName = formatComponentName(name)
  const svgText = text.replace(currentColorRegexp, 'currentColor')

  if (namesMap[componentName]) {
    console.log(`Name conflict: '${name}' and '${namesMap[componentName]}'`)
    return
  }

  namesMap[componentName] = name

  const component = `
    import React, { FC } from 'react'
    
    const ${componentName}: FC<{}> = () => {
        return ${svgText}
    }
        
    export { ${componentName} }
`

  saveIconComponent(componentName, component)
  saveIconSvg(componentName, svgText)
}

async function loadIcons(id: string) {
  const node = await loadNode(id)

  if (!node?.components) {
    return
  }

  const { components } = node
  const ids = Object.keys(components)

  const {
    data: { images },
  } = await loadSvgUrls(ids)

  const queue: Promise<unknown>[] = []

  for (const id of ids) {
    const iconUrl = images[id]
    const saveIconPromise = fetch(iconUrl)
      .then((res) => res.text())
      .then((iconText) => saveIcon(components[id].name, iconText))
      .catch((e) => console.log(e))

    queue.push(saveIconPromise)

    if (queue.length === QUEUE_SIZE) {
      await Promise.all(queue)
      queue.length = 0
    }
  }

  await Promise.all(queue)
}

export { loadIcons }
