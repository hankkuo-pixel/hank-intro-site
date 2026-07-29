const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const indexPath = path.join(root, 'dist/index.html')
let html = fs.readFileSync(indexPath, 'utf8')

const mimeByExt = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

function inlineLocalImages(source) {
  return source.replace(/\.\/(?:images|uploads)\/[A-Za-z0-9_.@()-]+/g, (assetPath) => {
    const filePath = path.join(root, 'dist', assetPath.slice(2))
    if (!fs.existsSync(filePath)) return assetPath

    const ext = path.extname(filePath).toLowerCase()
    const mime = mimeByExt[ext]
    if (!mime) return assetPath

    const encoded = fs.readFileSync(filePath).toString('base64')
    return `data:${mime};base64,${encoded}`
  })
}

function escapeInlineScript(source) {
  return source.replace(/<\/script/gi, '<\\/script')
}

const jsMatch = html.match(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/)
const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+\.css)">/)

if (!jsMatch || !cssMatch) {
  throw new Error('Cannot find built JS/CSS assets in dist/index.html')
}

const js = escapeInlineScript(inlineLocalImages(fs.readFileSync(path.join(root, 'dist', jsMatch[1]), 'utf8')))
const css = inlineLocalImages(fs.readFileSync(path.join(root, 'dist', cssMatch[1]), 'utf8'))

html = html.replace(jsMatch[0], '')
html = html.replace(cssMatch[0], `<style>\n${css}\n</style>`)
html = html.replace('</body>', `<script>\n${js}\n</script>\n  </body>`)

const outPath = path.join(root, 'dist/preview.html')
fs.writeFileSync(outPath, html)

const preview = fs.readFileSync(outPath, 'utf8')
const appIndex = preview.indexOf('<div id="app"')
const scriptIndex = preview.indexOf('<script>')

if (appIndex < 0 || scriptIndex < 0 || scriptIndex < appIndex) {
  throw new Error('preview.html script order is invalid')
}

console.log(outPath)
