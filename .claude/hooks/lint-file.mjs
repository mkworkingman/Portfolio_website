// PostToolUse (Edit|Write): lint --fix the touched file. Exit 2 feeds remaining errors back to Claude.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const file = input.tool_input?.file_path
if (!file) process.exit(0)

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const rel = path.relative(root, path.resolve(root, file)).replaceAll('\\', '/')
if (rel.startsWith('..') || rel.startsWith('node_modules/') || rel.startsWith('dist/')) process.exit(0)

let cmd
if (/\.scss$/.test(rel) && rel.startsWith('src/styles/')) {
    cmd = ['stylelint', '--fix', rel]
} else if (/^(src\/scripts\/.*\.ts|tests\/.*\.ts|index\.html)$/.test(rel)) {
    cmd = ['eslint', '--fix', '--quiet', rel]
} else {
    process.exit(0)
}

const res = spawnSync(`npx --no-install ${cmd.slice(0, -1).join(' ')} "${rel}"`, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
})
if (res.status !== 0) {
    const out = `${res.stdout}\n${res.stderr}`.trim().split('\n').slice(0, 40).join('\n')
    process.stderr.write(`${cmd[0]} found errors in ${rel}:\n${out}\n`)
    process.exit(2)
}
