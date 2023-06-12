import type Configure from '@adonisjs/core/commands/configure'

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  await command.updateRcFile((rcFile) => {
    rcFile.addCommand('adonis-sail/commands')
  })
}
