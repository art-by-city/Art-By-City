import Arweave from 'arweave'
import { createData, DataItem } from 'arbundles'
import { Signer } from 'arbundles/src/signing'
import { getSignatureData } from 'arbundles/src/ar-data-base'

export default class DataItemFactory {
  static async create(
    data: string | Uint8Array,
    signer: Signer,
    tags?: { name: string, value: string }[]
  ): Promise<DataItem> {
    const dataItem = createData(data, signer, { tags })

    await signDataItem(dataItem, signer)

    return dataItem
  }
}

async function signDataItem(item: DataItem, signer: Signer): Promise<Buffer> {
  const { signature, id } = await getSignatureAndId(item, signer)

  item.getRaw().set(signature, 2)

  return id
}

async function getSignatureAndId(
  item: DataItem,
  signer: Signer,
): Promise<{ signature: Buffer; id: Buffer }> {
  const signatureData = await getSignatureData(item)
  const signatureBytes = await signer.sign(signatureData)
  const idBytes = await Arweave.crypto.hash(signatureBytes)

  return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) }
}
