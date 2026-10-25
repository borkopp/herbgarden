const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? files(file) : /\.(js|json|js\.map)$/.test(file) ? [file] : []
  })
}
function finalize(root, env = process.env) {
  if (!env.NEXT_PUBLIC_SERVER_URL) throw new Error('NEXT_PUBLIC_SERVER_URL is required')
  const dist = path.resolve(root, '.next')
  const hashes = []
  // Server chunks read the real runtime environment. Do not inline them: a
  // dependency may assign a default to process.env, which cannot become a literal LHS.
  for (const file of files(path.join(dist, 'static'))) {
    const original = fs.readFileSync(file, 'utf8')
    const content = original.replace(/[\w]+(?:\.env)?\.(NEXT_PUBLIC_[\w]+)/g, (match, key) =>
      env[key] ? JSON.stringify(env[key]) : match,
    )
    if (content === original) continue
    const oldHash = path.basename(file).match(/([a-z0-9]{16})\./)?.[1]
    if (!oldHash) throw new Error(`Cannot identify browser chunk hash: ${file}`)
    const newHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16)
    fs.writeFileSync(file, content)
    fs.renameSync(file, file.replace(oldHash, newHash))
    hashes.push([oldHash, newHash])
  }
  const manifests = fs.readdirSync(dist).filter((name) => /\.(js|json|js\.map)$/.test(name)).map((name) => path.join(dist, name))
  for (const file of [...files(path.join(dist, 'static')), ...files(path.join(dist, 'server')), ...manifests]) {
    let content = fs.readFileSync(file, 'utf8')
    for (const [before, after] of hashes) content = content.replaceAll(before, after)
    fs.writeFileSync(file, content)
  }
  for (const file of files(path.join(dist, 'static'))) {
    if (file.endsWith('.js') && /\.env\.NEXT_PUBLIC_SERVER_URL\b/.test(fs.readFileSync(file, 'utf8'))) {
      throw new Error('Unresolved public API URL in browser output')
    }
  }
  return hashes
}
module.exports = { finalize }
if (require.main === module) {
  finalize(process.argv[2] || '.next/standalone')
  console.log('Public browser settings finalized; server runtime environment preserved.')
}
