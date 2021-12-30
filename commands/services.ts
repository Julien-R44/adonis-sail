export interface ServiceDefinition {
  key: string
  promptName: string
  hasVolume: boolean
  envVarPrefix?: string
  host?: string
  type?: string
  connectionName?: string
}

export const SERVICES: ServiceDefinition[] = [
  {
    key: 'redis',
    promptName: 'Redis',
    hasVolume: true,
  },
  {
    key: 'pgsql',
    promptName: 'PostgreSQL',
    envVarPrefix: 'PG',
    host: 'pgsql',
    type: 'database',
    hasVolume: true,
    connectionName: 'pg',
  },
  {
    key: 'mysql',
    promptName: 'MySQL',
    envVarPrefix: 'MYSQL',
    host: 'mysql',
    type: 'database',
    hasVolume: true,
    connectionName: 'mysql',
  },
  {
    key: 'minio',
    promptName: 'MinIO',
    hasVolume: true,
  },
  {
    key: 'mailhog',
    promptName: 'MailHog',
    hasVolume: false,
  },
]
