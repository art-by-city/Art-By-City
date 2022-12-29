export type ArkAddress = {
  address: string
  ark_key: string
  is_evaluated: boolean
  is_verified: boolean
  network: string
  verification_req: string
}

export interface ArkIdentity {
  arweave_address: string
  first_linkage: number
  is_verified: boolean
  last_modification: number
  primary_address: string
  public_key: string
  addresses: ArkAddress[]
  unevaluated_addresses: ArkAddress[]
}
