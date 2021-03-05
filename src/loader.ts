import * as dotenv from 'dotenv'
import { Client } from 'figma-js'

dotenv.config()

const client = Client({
  personalAccessToken: process.env.FIGMA_TOKEN,
})

const documentId = process.env.DOCUMENT_ID!

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

export { loadRoot, loadNode, loadNodes, loadSvgUrls }
