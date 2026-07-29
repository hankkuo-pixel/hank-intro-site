const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const inputPath = path.join(root, 'simple-preview.html')
const outputPath = path.join(root, 'simple-preview-inline.html')

const mimeByExt = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

let html = fs.readFileSync(inputPath, 'utf8')

html = html.replace(/src="(public\/[^"]+)"/g, (match, assetPath) => {
  const filePath = path.join(root, assetPath)
  if (!fs.existsSync(filePath)) return match

  const mime = mimeByExt[path.extname(filePath).toLowerCase()]
  if (!mime) return match

  const encoded = fs.readFileSync(filePath).toString('base64')
  return `src="data:${mime};base64,${encoded}"`
})

fs.writeFileSync(outputPath, html)

console.log(outputPath)
