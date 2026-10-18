// Patches the installed og-image plugin so satori also loads the theme's
// `typography.cjk` font and appends it as a font-family fallback in the OG
// card component. Without this, pages with CJK titles/descriptions render
// tofu boxes in their social preview cards.
// Idempotent: skips when already patched or when the plugin is absent.
import fs from "node:fs"
import path from "node:path"

const dist = path.resolve(".quartz/plugins/og-image/dist/index.js")

if (!fs.existsSync(dist)) {
  console.log("patch-og-image-cjk: og-image plugin not installed, skipping")
  process.exit(0)
}

let src = fs.readFileSync(dist, "utf8")

if (src.includes("typography.cjk")) {
  console.log("patch-og-image-cjk: already patched")
  process.exit(0)
}

const fontLoadAnchor = "const fonts = await getSatoriFonts(headerFont, bodyFont);"
const fontLoadPatched = `${fontLoadAnchor}
      if (theme.typography.cjk) {
        fonts.push(...await getSatoriFonts(theme.typography.cjk, theme.typography.cjk));
      }`

const fontNameAnchor = `  const bodyFont = getFontSpecificationName(theme.typography.body);
  const headerFont = getFontSpecificationName(theme.typography.header);`
const fontNamePatched = `  const cjkFontName = theme.typography.cjk
    ? \`, \${getFontSpecificationName(theme.typography.cjk)}\`
    : "";
  const bodyFont = \`\${getFontSpecificationName(theme.typography.body)}\${cjkFontName}\`;
  const headerFont = \`\${getFontSpecificationName(theme.typography.header)}\${cjkFontName}\`;`

const fontLoadCount = src.split(fontLoadAnchor).length - 1
if (fontLoadCount === 0 || !src.includes(fontNameAnchor)) {
  console.error(
    "patch-og-image-cjk: patch anchors not found in og-image dist; plugin version may have changed",
  )
  process.exit(1)
}

src = src.split(fontLoadAnchor).join(fontLoadPatched)
src = src.replace(fontNameAnchor, fontNamePatched)

fs.writeFileSync(dist, src)
console.log(`patch-og-image-cjk: patched ${fontLoadCount} font-loading site(s) + card font families`)
