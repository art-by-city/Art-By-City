import path from 'path'
import fs from 'fs/promises'
import { transformAsync } from '@babel/core'
import prettier from 'prettier'

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

    const babelResult = await transformAsync(src.toString(), opts)

    if (babelResult?.code) {
      const prettyCode = prettier.format(babelResult.code, { parser: 'babel' })

      await fs.writeFile(`contracts/src/${name}/contract.js`, prettyCode)
    }
  }
}

(async () => {
  await build()
})()
