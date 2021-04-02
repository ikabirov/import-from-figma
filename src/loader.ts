import { Client, ClientInterface } from 'figma-js'
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

function loadSvgUrls(ids: string[]) {
  return client.fileImages(documentId, {
    ids,
    format: 'svg',
  })
}

export { initializeLoader, loadRoot, loadNode, loadNodes, loadSvgUrls }
