export interface ArweaveConfig {
  app: ArweaveAppConfig
  api: ArweaveApiConfig,
  contracts: {
    [key: string]: string
  }
}

export interface ArweaveApiConfig {
  protocol: string
  host: string
  port: string | number
}

export interface ArweaveAppConfig {
  name: string
  version: string
}
