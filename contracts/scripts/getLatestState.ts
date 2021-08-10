import Arweave from 'arweave'
import { readContract } from 'smartweave'

const arweave = new Arweave({
  protocol: process.env.ARWEAVE_PROTOCOL || 'http',
  host: process.env.ARWEAVE_HOST || 'localhost',
  port: process.env.ARWEAVE_PORT || 1984
})

async function getLatestState(contractId: string) {
  const latestState = await readContract(arweave, contractId)

  console.log(latestState)
}

(async () => {
  try {
    await getLatestState('AfctuG5LxuNFdUjulh6JF2RetVWCG7-TINyAsMWUQf8')
  } catch (error) {
    console.error(error.message)
  }
})()
