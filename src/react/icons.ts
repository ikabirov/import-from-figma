import { Icons } from '../dsl'

import { saveIconComponent } from './resource'

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
        return <div
        dangerouslySetInnerHTML={{
          __html: \`${svgText}\`,
        }}
      />
    }
        
    export { ${componentName} }
`

  saveIconComponent(componentName, component)
  // saveIconSvg(componentName, svgText)
}

async function writeIcons(icons: Icons) {
  Object.keys(icons).forEach(key => saveIcon(key, icons[key]))
}

export { writeIcons }
