import Arweave from 'arweave'
import { interactWrite } from 'smartweave'
import testWeaveJWK from 'testweave-sdk/src/assets/arweave-keyfile-MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y.json'

const arweave = new Arweave({
  protocol: process.env.ARWEAVE_PROTOCOL || 'http',
  host: process.env.ARWEAVE_HOST || 'localhost',
  port: process.env.ARWEAVE_PORT || 1984
})

// TODO -> get wallet from environment
const wallet = testWeaveJWK

async function updateState(contractId: string) {
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
