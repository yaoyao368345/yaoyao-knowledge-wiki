import matter from 'gray-matter';

// Use the final rendered heading id; Markdown-stage slugs omit footnote numbers.
export function readableText(node) {
  if (node.type === 'text') return node.value || '';
  const props = node.properties || {};
  const classes = Array.isArray(props.className) ? props.className : [];
  if (node.tagName === 'annotation' || classes.includes('katex-mathml') ||
      props.dataFootnoteRef !== undefined || props['data-footnote-ref'] !== undefined) return '';
  return (node.children || []).map(readableText).join('');
}

export function prepareTitle(tree, file) {
  const first = tree.children.find(n => n.type !== 'yaml');
  const explicit = matter(String(file.value || '')).data.title;
  if (first?.type === 'heading' && first.depth === 1) {
    const plain = node => node.value || (node.children || []).map(plain).join('');
    const heading = plain(first).trim();
    file.data.frontmatter.title = explicit || heading;
    // Remove only the leading heading when it duplicates the displayed title.
    if (String(file.data.frontmatter.title).trim() === heading) {
      tree.children.splice(tree.children.indexOf(first), 1);
    }
  }
}

export function collectToc(tree, file) {
  if (file.data.frontmatter?.enableToc === false) { delete file.data.toc; return; }
  const toc = [];
  const walk = node => {
    if (/^h[2-4]$/.test(node.tagName || '') && node.properties?.id && node.properties.id !== 'footnote-label') {
      toc.push({depth: Number(node.tagName[1]) - 2, slug: String(node.properties.id), text: readableText(node).trim()});
    }
    for (const child of node.children || []) walk(child);
  };
  walk(tree);
  if (toc.length) file.data.toc = toc;
  else delete file.data.toc;
}

export function KnowledgeContent() {
  return {
    name: 'KnowledgeContent',
    markdownPlugins: () => [() => prepareTitle],
    htmlPlugins: () => [() => collectToc],
  };
}
