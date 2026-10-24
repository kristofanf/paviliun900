import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'

export function createCommandRunner(root) {
  // npm is a command script on Windows. Launch its JavaScript entry point
  // through Node instead, keeping every argument out of a shell.
  const npmCli = process.env.npm_execpath || (process.platform === 'win32'
    ? join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js') : null)
  return (file, args, { cwd = root } = {}) => {
    if (file === 'npm' && npmCli) {
      file = process.execPath
      args = [npmCli, ...args]
    }
    return execFileSync(file, args, {
      cwd, encoding: 'utf8', timeout: 180000, stdio: 'pipe', shell: false,
      windowsHide: true, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    })
  }
}
