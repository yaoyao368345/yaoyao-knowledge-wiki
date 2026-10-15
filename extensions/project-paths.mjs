// Compatibility for the locked Quartz v5 community scripts on project Pages.
// Adapt generated resources, never the downloaded plugin cache.
function replaceRequired(script, pattern, replacement, expected, label) {
  let count = 0
  const result = script.replaceAll(pattern, (...args) => {
    count++
    return typeof replacement === "function" ? replacement(...args) : replacement
  })
  if (count !== expected) {
    throw new Error(`Project path adapter: ${label} matched ${count}, expected ${expected}. Review the locked plugin version.`)
  }
  return result
}

export function adaptProjectPaths(script, baseUrl) {
  if (!baseUrl) return script
  const prefix = new URL(`https://${baseUrl}`).pathname.replace(/\/+$/, "")
  if (!prefix) return script

  const kind = script.includes("[Explorer]") ? "explorer"
    : script.includes("[Graph]") ? "graph"
    : script.includes("result-card") && script.includes("/static/contentIndex.json") ? "search"
    : null
  if (!kind) return script

  const siteRoot = JSON.stringify(`${prefix}/`)
  script = replaceRequired(script, '"/static/contentIndex.json"',
    JSON.stringify(`${prefix}/static/contentIndex.json`), 1, `${kind} content index`)

  if (kind === "explorer" || kind === "search") {
    script = replaceRequired(script, '.href="/"+', `.href=${siteRoot}+`,
      kind === "explorer" ? 2 : 1, `${kind} navigation`)
  }
  if (kind === "search") {
    script = replaceRequired(script, 'new URL("/"+', `new URL(${siteRoot}+`, 1, "search preview")
  }
  if (kind === "graph") {
    script = replaceRequired(script, 'window.location.pathname',
      '("/"+(document.body.dataset.slug||"index"))', 1, "graph current page")
    script = replaceRequired(script,
      /function ([$\w]+)\(([$\w]+)\)\{return \2\.startsWith\("\/"\)\?\2:"\/"\+\2\}/g,
      (_match, name, arg) => `function ${name}(${arg}){return ${JSON.stringify(prefix)}+(${arg}.startsWith("/")?${arg}:"/"+${arg})}`,
      1, "graph navigation")
  }
  return script
}
