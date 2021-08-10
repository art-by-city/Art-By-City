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
    await getLatestState('ePx3JV9aBi9oRcj3GT0bQh0Y6dLnp4gDKHLGfZ0hYL0')
  } catch (error) {
    console.error(error.message)
  }
})()
