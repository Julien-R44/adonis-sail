import { test } from '@japa/runner'

import InstallSail from '../commands/install_sail.js'
import { createApp } from '../tests_helpers/index.js'

test.group('Install sail', () => {
  test('should throw if no .env file', async () => {
    const app = await createApp()

    const ace = await app.container.make('ace')
    const command = await ace.create(InstallSail, ['../commands/install_sail'])

    command.ui.switchMode('raw')

    await command.exec()

    command.assertFailed()
    command.assertLogMatches(/No .env file found at the root of your application/)
  })

  test('generate compose.yml file', async ({ assert, fs }) => {
    const app = await createApp()
    await fs.create('.env', 'PORT=3333')

    const ace = await app.container.make('ace')
    const command = await ace.create(InstallSail, ['../commands/install_sail'])
    command.ui.switchMode('raw')

    command.prompt
      .trap('Select services you want to run along your Adonis Application')
      .chooseOptions([0, 1])

    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('compose.yml')
    assert.snapshot(await fs.contents('compose.yml')).match()
  })
})
