import fs from 'fs/promises'
import Arweave from 'arweave'
import { interactWrite } from 'smartweave'

const arweave = new Arweave({
  protocol: process.env.ARWEAVE_PROTOCOL || 'http',
  host: process.env.ARWEAVE_HOST || 'localhost',
  port: process.env.ARWEAVE_PORT || 1984
})

async function updateState(contractId: string) {
  // Read wallet file, path from environment
  const wallet = JSON.parse(
    (await fs.readFile(process.env.DEPLOYER_KEYFILE || '')).toString()
  )

  const input = {
    function: 'register',
    username: 'Jim'
  }

  const txId = await interactWrite(arweave, wallet, contractId, input)

  console.log('Updated State TX ID', txId)
}

(async () => {
  try {
    await updateState('AfctuG5LxuNFdUjulh6JF2RetVWCG7-TINyAsMWUQf8')
  } catch (error) {
    console.error(error.message)
  }
})()
