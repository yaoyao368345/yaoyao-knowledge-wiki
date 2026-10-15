import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareTitle, collectToc } from '../extensions/knowledge-content.mjs';
const text = value => ({type:'text',value});
const heading = {type:'heading',depth:1,children:[text('Week 1')]};
test('derive title and remove only leading duplicate from AST, not source', () => {
 const value='# Week 1\n\n# Example'; const file={value,data:{frontmatter:{title:'week1-original'}}};
 const tree={children:[structuredClone(heading),{type:'heading',depth:1,children:[text('Example')]}]};
 prepareTitle(tree,file); assert.equal(file.data.frontmatter.title,'Week 1'); assert.equal(tree.children.length,1); assert.equal(file.value,value);
});
test('explicit different frontmatter title preserves heading', () => {
 const file={value:'---\ntitle: Custom\n---\n# Week 1',data:{frontmatter:{title:'Custom'}}}; const tree={children:[structuredClone(heading)]};
 prepareTitle(tree,file);assert.equal(tree.children.length,1);assert.equal(file.data.frontmatter.title,'Custom');
});
test('final HTML ids include footnotes, text excludes reference and duplicate math accessibility text', () => {
 const file={data:{frontmatter:{}}}; const tree={children:[
  {tagName:'h2',properties:{id:'heading2'},children:[text('Heading'),{tagName:'a',properties:{dataFootnoteRef:true},children:[text('2')]}]},
  {tagName:'h3',properties:{id:'if-alpha'},children:[text('If '),{tagName:'span',properties:{className:['katex-mathml']},children:[text('alpha duplicate')]},text('α is small')]},
  {tagName:'h2',properties:{id:'footnote-label'},children:[text('Footnotes')]}
 ]};collectToc(tree,file);assert.deepEqual(file.data.toc,[{depth:0,slug:'heading2',text:'Heading'},{depth:1,slug:'if-alpha',text:'If α is small'}]);
});
test('explicit TOC opt-out is respected',()=>{const file={data:{frontmatter:{enableToc:false},toc:[1]}};collectToc({children:[]},file);assert.equal(file.data.toc,undefined)});
