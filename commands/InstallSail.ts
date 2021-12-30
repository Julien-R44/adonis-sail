import { BaseCommand } from '@adonisjs/core/build/standalone'
import { join, resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { ServiceDefinition, SERVICES } from './services'

export default class InstallSail extends BaseCommand {
  public static commandName = 'sail:install'
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
      Object.values(SERVICES).map((service) => service.promptName)
    )

    const selectedServicesDefinitions = services.map(
      (service) => SERVICES.find((s) => s.promptName === service) as ServiceDefinition
    )

    this.logger.info('Generating docker-compose.yml file...')

    this.buildDockerCompose(selectedServicesDefinitions)
    await this.replaceEnvVariables(selectedServicesDefinitions)

    this.logger.success('Docker-compose file generated successfully')
  }

  /**
   * Build docker-compose file by assembling selected services stubs
   */
  private buildDockerCompose(services: ServiceDefinition[]) {
    const stubsDir = resolve('./node_modules/adonis-sail/build/stubs')

    const stubs = services
      .map((service) => readFileSync(join(stubsDir, `${service.key}.stub`), 'utf8'))
      .join('\n')

    let volumes = services
      .filter((service) => service.hasVolume)
      .map((service) => `  sail${service.key}:`)
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
  private async replaceEnvVariables(services: ServiceDefinition[]) {
    const envFilePath = join(this.application.appRoot, '.env')
    let env = readFileSync(envFilePath, 'utf8')

    services.forEach((service) => {
      if (service.type === 'database') {
        const host = `${service.envVarPrefix}_HOST`
        env = env.replace(new RegExp(`(${host})=.*`), `$1=localhost`)
      }

      if (service.key === 'redis') {
        const redisHost = `REDIS_HOST`
        env = env.replace(new RegExp(`(${redisHost})=.*`), `$1=localhost`)
      }
    })

    const primaryDatabase = await this.selectPrimaryDatabase(services)
    if (primaryDatabase) {
      env = env.replace(new RegExp(`(DB_CONNECTION)=.*`), `$1=${primaryDatabase}`)
    }

    writeFileSync(envFilePath, env)
  }

  /**
   * Prompt user to select his primary database and assign it to DB_CONNECTION env var
   */
  private async selectPrimaryDatabase(services: ServiceDefinition[]): Promise<string | undefined> {
    const databasesServices = services.filter((service) => service.type === 'database')

    if (databasesServices.length === 0) {
      return
    }

    const hasMultipleDatabases = databasesServices.length > 1

    if (hasMultipleDatabases) {
      let primaryDatabase = await this.prompt.choice(
        'Select your primary database',
        services
          .filter((service) => service.type === 'database')
          .map((service) => service.promptName)
      )

      return SERVICES.find((s) => s.promptName === primaryDatabase)?.connectionName
    }

    return databasesServices[0].connectionName
  }
}
