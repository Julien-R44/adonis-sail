import { join } from 'node:path'
import type { Application } from '@adonisjs/core/app'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import { stubsRoot } from '../index.js'
import type { ServiceDefinition } from './types/index.js'

export class ComposeGenerator {
  #generatedFile: string | null = null

  constructor(public app: Application<any>) {}

  /**
   * Generate docker-compose.yml file and store it in memory
   */
  generate(services: ServiceDefinition[]) {
    const stubs = services
      .map((service) => readFileSync(join(stubsRoot, 'services', `${service.key}.stub`), 'utf8'))
      .join('\n')

    let volumes = services
      .filter((service) => service.hasVolume)
      .map((service) => `  sail${service.key}:`)
      .join('\n')

    if (volumes.length) {
      volumes = `volumes:\n${volumes}`
    }

    let finalFile = readFileSync(join(stubsRoot, 'services', 'docker-compose.stub'), 'utf8')
    finalFile = finalFile.replace('{{services}}', stubs)
    finalFile = finalFile.replace('{{volumes}}', volumes)

    this.#generatedFile = finalFile

    return this
  }

  /**
   * Returns the generated file
   */
  getGeneratedFile() {
    return this.#generatedFile
  }

  /**
   * Write generated file to disk at the root of the application
   */
  write() {
    if (!this.#generatedFile) {
      throw new Error('No file generated')
    }

    if (!existsSync(this.app.appRoot)) {
      mkdirSync(this.app.appRoot, { recursive: true })
    }

    writeFileSync(new URL('docker-compose.yml', this.app.appRoot), this.#generatedFile)
  }
}
