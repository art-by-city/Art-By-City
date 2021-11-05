type MetadataPropertiesValues = string | number | string[] | number[]
type MetadataPropertiesBase = { [key: string]: MetadataPropertiesValues }
type MetadataPropertiesBaseAndValues =
  | MetadataPropertiesBase
  | MetadataPropertiesValues
type MetadataProperties =
  | { [key: string]: MetadataPropertiesBaseAndValues }
  | MetadataPropertiesBaseAndValues

export interface ERC721MetadataJSONSchema {
  name: string
  description: string
  image: string
}

export interface ERC1155MetadataURIJsonSchema extends ERC721MetadataJSONSchema {
  properties?: { [key: string]: MetadataProperties }
  localization?: any // TODO
}

export interface OpenSeaNFTMetaData extends ERC1155MetadataURIJsonSchema {
  external_url: string
  background_color?: string
  animation_url?: string
  youtube_url?: string
  attributes?: any[] // TODO
}
