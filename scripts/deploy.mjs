import { copyFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCommandRunner } from './commands.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

export function deployStatic({ root = ROOT, runCommand = createCommandRunner(root) } = {}) {
  runCommand('npm', ['run', 'build'])
  const dist = join(root, 'dist')
  copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
  writeFileSync(join(dist, 'CNAME'), 'paviliun900.com\n')
  const options = { cwd: dist }
  runCommand('git', ['init'], options)
  runCommand('git', ['add', '-A'], options)
  runCommand('git', ['commit', '--allow-empty', '-m', 'deploy'], options)
  runCommand('git', ['push', '-f', 'https://github.com/kristofanf/paviliun900.git', 'HEAD:production'], options)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { deployStatic(); console.log('Static site published.') }
  catch (error) {
    console.error(error.stderr?.trim() || error.message)
    console.error('Static site deployment failed. Check the build and configured Git credentials.')
    process.exitCode = 1
  }
}
