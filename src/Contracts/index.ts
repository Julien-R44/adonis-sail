export interface ServiceDefinition {
  key: string
  promptName: string
  hasVolume: boolean
  envVarPrefix?: string
  host?: string
  type?: string
  connectionName?: string
}
