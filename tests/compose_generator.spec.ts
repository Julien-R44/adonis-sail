import { test } from '@japa/runner'
import { AppFactory } from '@adonisjs/core/factories/app'

import { Services } from '../src/services.js'
import { ComposeGenerator } from '../src/compose_generator.js'

test.group('Compose Generator', () => {
  test('should generate compose.yml file', async ({ assert }) => {
    const generator = new ComposeGenerator({} as any)

    const result = generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
      ])
      .getGeneratedFile()

    assert.snapshot(result).match()
  })

  test('should generate compose.yml file with selected services', async ({ assert }) => {
    const generator = new ComposeGenerator({} as any)

    const result = generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
        Services.find((s) => s.key === 'redis')!,
        Services.find((s) => s.key === 'minio')!,
      ])
      .getGeneratedFile()

    assert.snapshot(result).match()

    assert.include(result, 'minio:')
    assert.include(result, 'redis:')
    assert.include(result, 'pgsql:')
    assert.include(result, 'mysql:')
  })

  test('should add volumes for services with volumes', async ({ assert }) => {
    const generator = new ComposeGenerator({} as any)

    const result = generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
      ])
      .getGeneratedFile()

    assert.snapshot(result).match()

    assert.include(result, 'volumes:')
    assert.include(result, '  sailmysql:')
    assert.include(result, '  sailpgsql:')
  })

  test('write should write the generated file to disk at app root', async ({ assert, fs }) => {
    const application = new AppFactory().create(fs.baseUrl, () => {})
    const generator = new ComposeGenerator(application)

    generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
      ])
      .write()

    assert.fileExists('compose.yml')
    const content = await fs.contents('compose.yml')

    assert.snapshot(content).match()
  })
})
