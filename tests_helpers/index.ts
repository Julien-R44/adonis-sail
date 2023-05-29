import { IgnitorFactory } from '@adonisjs/core/factories'

export const BASE_URL = new URL('../tests/__app/', import.meta.url)

export async function createApp() {
  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .create(BASE_URL, {
      importer: (filePath) => {
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          return import(new URL(filePath, BASE_URL).href)
        }

        return import(filePath)
      },
    })

  const app = ignitor.createApp('web')
  await app.init()
  await app.boot()

  return app
}
