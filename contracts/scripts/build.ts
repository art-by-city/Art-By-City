import path from 'path'
import fs from 'fs/promises'
import { transformAsync } from '@babel/core'

const contracts = [
  'usernames'
]

const opts = {
  configFile: path.resolve(__dirname, '../babel.config.json'),
  filename: 'contract.ts'
}

async function build() {
  for (const name of contracts) {
    const src = await fs.readFile(`contracts/src/${name}/contract.ts`)

    const out = await transformAsync(src.toString(), opts)

    if (out?.code) {
      await fs.writeFile(`contracts/src/${name}/contract.js`, out.code)
    }
  }
}

(async () => {
  await build()
})()
