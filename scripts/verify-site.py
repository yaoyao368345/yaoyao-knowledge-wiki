from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,sys,os
lab=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=set();self.refs=[];self.math=0;self.errors=0;self.codes=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag in ['a','link'] and a.get('href'):self.refs.append((tag,a['href']))
  if tag in ['img','script'] and a.get('src'):self.refs.append((tag,a['src']))
  if tag=='mjx-container' or 'katex' in (a.get('class') or '').split():self.math+=1
  if tag=='mjx-merror' or 'katex-error' in (a.get('class') or '').split():self.errors+=1
  if tag=='pre':self.codes+=1
base=urlsplit(os.environ.get('PAGES_URL','')).path.rstrip('/')
specs=[('quartz',lab/'public',base)]
results={}
for name,root,base in specs:
 if not root.exists():continue
 pages={p.resolve():Page(p.read_text(encoding='utf-8')) for p in root.rglob('*.html')}
 missing=[];badanchors=[];tested=0;external=0
 for file,page in pages.items():
  for kind,url in page.refs:
   split=urlsplit(url)
   if split.scheme or split.netloc:external+=1;continue
   target=unquote(split.path)
   if base and (target==base or target.startswith(base+'/')):target=target[len(base):] or '/'
   if not target:dest=file
   elif target.startswith('/'):dest=(root/target.lstrip('/')).resolve()
   else:dest=(file.parent/target).resolve()
   tested+=1
   candidates=[dest]
   if dest.is_dir() or target.endswith('/'):candidates=[dest/'index.html']
   elif not dest.suffix:candidates=[Path(str(dest)+'.html'),dest/'index.html',dest]
   existing=next((p.resolve() for p in candidates if p.is_file()),None)
   if not existing:missing.append({'page':file.relative_to(root).as_posix(),'url':url,'kind':kind});continue
   if split.fragment and existing in pages and split.fragment not in pages[existing].ids and unquote(split.fragment) not in pages[existing].ids:badanchors.append({'page':file.relative_to(root).as_posix(),'url':url})
 acceptance=next((v for p,v in pages.items() if ('acceptance' in p.as_posix())),None)
 results[name]={'pages':len(pages),'referencesChecked':tested,'externalReferencesNotFetched':external,'missing':missing,'badAnchors':badanchors,'acceptance':{'math':acceptance.math,'errors':acceptance.errors,'codeBlocks':acceptance.codes} if acceptance else None,'passed':not(missing or badanchors)}
(lab/'reports').mkdir(parents=True,exist_ok=True)
(lab/'reports/site-validation.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
for name,result in results.items():print(name,json.dumps(result,ensure_ascii=False))

sys.exit(0 if all(r["passed"] for r in results.values()) else 1)
