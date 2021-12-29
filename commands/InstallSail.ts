import { BaseCommand } from '@adonisjs/core/build/standalone'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'

const SERVICES = {
  'redis': {
    hasVolume: true,
  },
  'redis-commander': {},
  'pgsql': {
    envVarPrefix: 'PG',
    host: 'pgsql',
    dbName: 'default',
    type: 'database',
    hasVolume: true,
  },
  'mysql': {
    envVarPrefix: 'MYSQL',
    host: 'mysql',
    dbName: 'default',
    type: 'database',
    hasVolume: true,
  },
}

export default class InstallSail extends BaseCommand {
  public static commandName = 'install:sail'
  public static description = 'Install Adonis Sail and generate Docker Compose file'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  /**
   * Prompt the user to select services to install
   */
  public async run() {
    const services = await this.prompt.multiple(
      'Select services you want to run along your Adonis Application',
      [
        { name: 'redis', message: 'Redis' },
        { name: 'redis-commander', message: 'Redis-Commander' },
        { name: 'pgsql', message: 'PostgreSQL' },
        { name: 'mysql', message: 'MySQL' },
      ]
    )

    this.logger.info('Generating docker-compose.yml file...')

    this.buildDockerCompose(services)
    this.replaceEnvVariables(services)

    this.logger.success('Docker-compose file generated successfully')
  }

  /**
   * Build docker-compose file by assembling selected services stubs
   */
  private buildDockerCompose(services: string[]) {
    const stubsDir = join(this.application.appRoot, '/providers/adonis-sail/stubs')

    const stubs = services
      .map((service) => readFileSync(join(stubsDir, `${service}.stub`), 'utf8'))
      .join('\n')

    let volumes = services
      .filter((service) => SERVICES[service].hasVolume)
      .map((service) => `  sail${service}:`)
      .join('\n')

    if (volumes.length) {
      volumes = `volumes:\n${volumes}`
    }

    let finalFile = readFileSync(join(stubsDir, 'docker-compose.stub'), 'utf8')
    finalFile = finalFile.replace('{{services}}', stubs)
    finalFile = finalFile.replace('{{volumes}}', volumes)

    writeFileSync(join(this.application.appRoot, 'docker-compose.yml'), finalFile)
  }

  /**
   * Replace .env variables with selected services values
   */
  private replaceEnvVariables(services: string[]) {
    const envFilePath = join(this.application.appRoot, '.env')
    let env = readFileSync(envFilePath, 'utf8')

    services.forEach((service) => {
      const serviceDef = SERVICES[service]

      if (serviceDef.type === 'database') {
        const host = `${serviceDef.envVarPrefix}_HOST`
        env = env.replace(new RegExp(`(${host})=.*`), `$1=${serviceDef.host}`)

        const password = `${serviceDef.envVarPrefix}_PASSWORD`
        env = env.replace(new RegExp(`(${password})=.*`), `$1=password`)

        const dbName = `${serviceDef.envVarPrefix}_DB_NAME`
        env = env.replace(new RegExp(`(${dbName})=.*`), `$1=${serviceDef.dbName}`)
      }

      if (service === 'redis') {
        const redisHost = `REDIS_HOST`
        env = env.replace(new RegExp(`(${redisHost})=.*`), `$1=redis`)
      }
    })

    writeFileSync(envFilePath, env)
  }
}
