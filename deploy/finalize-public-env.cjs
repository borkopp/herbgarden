const fs = require('node:fs')
const path = require('node:path')
const { inlineStaticEnv } = require('next/dist/lib/inline-static-env')
;(async () => {
  const root = path.resolve(process.argv[2] || '.next/standalone')
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw new Error('NEXT_PUBLIC_SERVER_URL is required')
  const distDir = path.join(root, '.next')
  const { config } = JSON.parse(fs.readFileSync(path.join(distDir, 'required-server-files.json'), 'utf8'))
  // Compile mode defers public environment substitution. Finalize the complete
  // standalone tree so server manifests and renamed client chunks stay in sync.
  await inlineStaticEnv({ distDir, config })
  const check = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = path.join(dir, item.name)
      if (item.isDirectory()) check(name)
      else if (name.endsWith('.js') && /\.env\.NEXT_PUBLIC_SERVER_URL\b/.test(fs.readFileSync(name, 'utf8'))) {
        throw new Error('An unresolved public server URL remains in a browser chunk')
      }
    }
  }
  check(path.join(distDir, 'static'))
  console.log('Standalone public environment finalized; browser URL substitution verified.')
})().catch((error) => { console.error(error); process.exitCode = 1 })
