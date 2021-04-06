import { Client, ClientInterface, FileImageResponse } from 'figma-js'
import { Config } from './config'

let client: ClientInterface
let documentId: string

function initializeLoader(config: Config) {
  client = Client({
    personalAccessToken: config.figmaToken,
  })

  documentId = config.projectId
}

function loadRoot() {
  return client.file(documentId)
}

async function loadNodes(ids: string[]) {
  const { data } = await client.fileNodes(documentId, {
    ids,
  })
  return Object.values(data.nodes)
}

async function loadNode(nodeId: string) {
  const nodes = await loadNodes([nodeId])
  return nodes[0]
}

function loadSvgUrls(ids: string[]): Promise<Record<string, string>> {
  const queueSize = 500
  return new Promise(async (resolve) => {
    const res: Record<string, string> = {}

    const total = ids.length
    let loaded = 0

    while (ids.length) {
      console.log(`fetch icons meta: ${((loaded / total) * 100).toFixed(2)}%`)

      const { data } = await client.fileImages(documentId, {
        ids: ids.slice(0, queueSize),
        format: 'svg',
      })

      ids = ids.slice(queueSize)

      Object.assign(res, data.images)

      loaded += queueSize
    }

    console.log(`fetch icons meta: 100%`)

    resolve(res)
  })
}

export { initializeLoader, loadRoot, loadNode, loadNodes, loadSvgUrls }
