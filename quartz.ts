import { PageTypeDispatcher } from './quartz/plugins/pageTypes/dispatcher'
import { loadQuartzConfig, loadQuartzLayout } from './quartz/plugins/loader/config-loader'
import { KnowledgeContent } from './extensions/knowledge-content.mjs'
import { Explorer } from './.quartz/plugins/explorer/dist/index.js'
import navigation from './navigation.json'
// @ts-ignore - Quartz bundles .inline scripts as browser resources.
import readerModeFeedback from './extensions/reader-mode-feedback.inline'

const config = await loadQuartzConfig()
// Run after upstream transforms: titles affect all emitters; TOC uses final HTML ids/text.
config.plugins.transformers.push(KnowledgeContent())
config.plugins.transformers.push({
  name: 'ReaderModeFeedback',
  externalResources: () => ({
    js: [{ contentType: 'inline', loadTime: 'afterDOMReady', script: readerModeFeedback }],
  }),
})
export default config

const order: Record<string, number> = {}
Object.entries(navigation).forEach(([folder, pages], group) => {
  order[folder] = group
  pages.forEach((page, index) => { order[`${folder}/${page}`] = index })
})
// Explorer serializes this function for its native client tree. Keep the map self-contained.
const sortFn = new Function('a', 'b', `
  const order = ${JSON.stringify(order)};
  const key = node => node.slugSegments.join('/');
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
  return (order[key(a)] ?? 999) - (order[key(b)] ?? 999)
    || (a.displayName || '').localeCompare(b.displayName || '', 'zh-CN', {numeric: true});
`)
const explorer = Explorer({title: '知识目录', sortFn})
export const layout = await loadQuartzLayout()
// Native Explorer remains responsible for rendering, folding, and active-page state.
for (const page of [layout.defaults, ...Object.values(layout.byPageType)]) {
  if (page.left?.length) page.left = [...page.left, explorer]
}

// v5 captures layout in its dispatcher during config loading; replace it with the configured layout.
config.plugins.emitters = config.plugins.emitters.filter(plugin => plugin.name !== "PageTypeDispatcher")
config.plugins.emitters.push(PageTypeDispatcher(layout))
