import { assert } from '@japa/assert'
import { specReporter } from '@japa/spec-reporter'
import { fileSystem } from '@japa/file-system'
import { expectTypeOf } from '@japa/expect-type'
import { runFailedTests } from '@japa/run-failed-tests'
import { processCliArgs, configure, run } from '@japa/runner'
import { pathToFileURL } from 'node:url'
import { snapshot } from '@japa/expect-snapshot'
import { getDirname } from '@poppinss/utils'
import { join } from 'node:path'

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.ts'],
    plugins: [
      assert(),
      runFailedTests(),
      fileSystem({
        basePath: join(getDirname(import.meta.url), '..', 'tests', '__app'),
      }),
      expectTypeOf(),
      snapshot(),
    ],
    reporters: [specReporter()],
    importer: (filePath: string) => import(pathToFileURL(filePath).href),
  },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
