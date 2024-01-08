import { existsSync } from 'node:fs'
import { BaseCommand } from '@adonisjs/core/ace'
import { readFile, writeFile } from 'node:fs/promises'

import { Services } from '../src/services.js'
import type { ServiceDefinition } from '../src/types/index.js'
import { ComposeGenerator } from '../src/compose_generator.js'

export default class InstallSail extends BaseCommand {
  static commandName = 'sail:install'
  static description = 'Install Adonis Sail and generate docker compose file'

  static settings = {
    loadApp: false,
    stayAlive: false,
  }

  /**
   * Ensure .env file exists at the root of the application. If not, throw an error
   */
  #ensureEnvFileExists() {
    if (existsSync(this.#envFilePath())) {
      return true
    }

    throw new Error(
      'No .env file found at the root of your application. Please create one before running sail:install',
    )
  }

  /**
   * Path to the application .env file
   */
  #envFilePath() {
    return new URL('.env', this.app.appRoot)
  }

  /**
   * Read the .env file and return its content
   */
  #readEnvFile() {
    return readFile(this.#envFilePath(), 'utf8')
  }

  /**
   * Prompt the user to select services to install
   */
  #promptServices() {
    return this.prompt.multiple(
      'Select services you want to run along your Adonis Application',
      Object.values(Services).map((service) => service.promptName),
    )
  }

  /**
   * Replace .env variables with selected services values
   */
  async #replaceEnvVariables(services: ServiceDefinition[]) {
    let env = await this.#readEnvFile()

    /**
     * Assign DB_CONNECTION to the primary database
     */
    const primaryDatabase = await this.#promptForPrimaryDatabase(services)
    if (primaryDatabase) {
      env = env.replace(new RegExp(`(DB_CONNECTION)=.*`), `$1=${primaryDatabase}`)
      this.logger.action(`DB_CONNECTION=${primaryDatabase}`).succeeded()
    }

    /**
     * Assign *_HOST to localhost for all databases
     */
    services.forEach((service) => {
      if (service.type === 'database') {
        const host = `${service.envVarPrefix}_HOST`
        env = env.replace(new RegExp(`(${host})=.*`), `$1=localhost`)
        this.logger.action(`${host}=localhost`).succeeded()
      }

      if (service.key === 'redis') {
        const redisHost = `REDIS_HOST`
        env = env.replace(new RegExp(`(${redisHost})=.*`), `$1=localhost`)
        this.logger.action(`${redisHost}=localhost`).succeeded()
      }
    })

    writeFile(this.#envFilePath(), env)
  }

  /**
   * Prompt user to select his primary database and assign it to DB_CONNECTION env var
   */
  async #promptForPrimaryDatabase(services: ServiceDefinition[]): Promise<string | undefined> {
    const databasesServices = services.filter((service) => service.type === 'database')
    if (databasesServices.length === 0) {
      return
    }

    const hasMultipleDatabases = databasesServices.length > 1

    if (hasMultipleDatabases) {
      const primaryDatabase = await this.prompt.choice(
        'Select your primary database',
        services
          .filter((service) => service.type === 'database')
          .map((service) => service.promptName),
      )

      return Services.find((s) => s.promptName === primaryDatabase)?.connectionName
    }

    return databasesServices[0].connectionName
  }

  /**
   * Run command
   */
  async run() {
    this.#ensureEnvFileExists()

    const services = await this.#promptServices()
    if (!services.length) {
      this.logger.info('No services selected. Exiting...')
      return
    }

    const selectedServicesDefinitions = services.map(
      (service) => Services.find((s) => s.promptName === service) as ServiceDefinition,
    )

    this.logger.info('Generating compose.yml file...')

    /**
     * Generate docker-compose.yml file and replace/add .env variables
     */
    new ComposeGenerator(this.app).generate(selectedServicesDefinitions).write()
    await this.#replaceEnvVariables(selectedServicesDefinitions)

    this.logger.success('Docker compose file generated successfully')
  }
}
