// Stop: if source files changed, require typecheck + lint + tests to pass before Claude stops.
// Exit 2 keeps Claude working with the failure output on stderr.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

readFileSync(0, 'utf8') // drain stdin
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const run = (cmd) =>
    spawnSync(cmd, { cwd: root, encoding: 'utf8', shell: true, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } })

const status = run('git status --porcelain').stdout || ''
const relevant = status
    .split('\n')
    .map((l) => l.slice(3).trim())
    .some((f) => /^(src\/|tests\/|index\.html$|vite\.config\.js$|eslint\.config\.js$|\.stylelintrc\.json$|tsconfig\.json$)/.test(f))
if (!relevant) process.exit(0)

const checks = [
    ['typecheck', 'npm run --silent typecheck'],
    ['lint', 'npm run --silent lint:all'],
    ['tests', 'npx --no-install vitest run --reporter=dot'],
]

const failures = []
for (const [name, cmd] of checks) {
    const res = run(cmd)
    if (res.status !== 0) {
        const out = `${res.stdout}\n${res.stderr}`.trim().split('\n').slice(-40).join('\n')
        failures.push(`### ${name} failed (${cmd})\n${out}`)
    }
}

if (failures.length) {
    process.stderr.write(`Checks failed. Fix them before finishing.\n\n${failures.join('\n\n')}\n`)
    process.exit(2)
}
