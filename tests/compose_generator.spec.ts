import { test } from '@japa/runner'
import { ComposeGenerator } from '../src/compose_generator.js'
import { Services } from '../src/services.js'
import { AppFactory } from '@adonisjs/core/factories/app'

test.group('Compose Generator', () => {
  test('should generate docker-compose.yml file', async ({ snapshot }) => {
    const generator = new ComposeGenerator({} as any)

    const result = generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
      ])
      .getGeneratedFile()

    snapshot.expect(result).toMatchSnapshot()
  })

  test('should generate docker-compose.yml file with selected services', async ({
    snapshot,
    assert,
  }) => {
    const generator = new ComposeGenerator({} as any)

    const result = generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
        Services.find((s) => s.key === 'redis')!,
        Services.find((s) => s.key === 'minio')!,
      ])
      .getGeneratedFile()

    snapshot.expect(result).toMatchSnapshot()

    assert.include(result, 'minio:')
    assert.include(result, 'redis:')
    assert.include(result, 'pgsql:')
    assert.include(result, 'mysql:')
  })

  test('should add volumes for services with volumes', async ({ snapshot, assert }) => {
    const generator = new ComposeGenerator({} as any)

    const result = generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
      ])
      .getGeneratedFile()

    snapshot.expect(result).toMatchSnapshot()

    assert.include(result, 'volumes:')
    assert.include(result, '  sailmysql:')
    assert.include(result, '  sailpgsql:')
  })

  test('write should write the generated file to disk at app root', async ({
    snapshot,
    assert,
    fs,
  }) => {
    const application = new AppFactory().create(fs.baseUrl, () => {})
    const generator = new ComposeGenerator(application)

    generator
      .generate([
        Services.find((s) => s.key === 'mysql')!,
        Services.find((s) => s.key === 'pgsql')!,
      ])
      .write()

    assert.fileExists('docker-compose.yml')
    const content = await fs.contents('docker-compose.yml')

    snapshot.expect(content).toMatchSnapshot()
  })
})
