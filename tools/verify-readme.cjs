const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require(process.env.README_PLAYWRIGHT_PATH || 'playwright');
const root=process.cwd();
const mime=f=>f.endsWith('.svg')?'image/svg+xml':f.endsWith('.png')?'image/png':'image/jpeg';
(async()=>{
  await fs.mkdir('preview',{recursive:true});
  const md=await fs.readFile('README.md','utf8');
  const response=await fetch('https://api.github.com/markdown',{method:'POST',headers:{'Content-Type':'application/json','User-Agent':'README-local-preview'},body:JSON.stringify({text:md,mode:'gfm'})});
  if(!response.ok)throw Error('GitHub Markdown API HTTP '+response.status+': '+await response.text());
  const rendered=await response.text();
  await fs.writeFile('preview/github-rendered.html',rendered);
  const refs=[...new Set([...rendered.matchAll(/(?:src|srcset)="(assets\/[^"]+)"/g)].map(m=>m[1]))];
  // GitHub's page scripts resolve the sanitizer's user-content anchor prefix.
  // Resolve it explicitly for this standalone local preview.
  let embedded=rendered.replace(/href="#([^"]+)"/g,(attribute,id)=>rendered.includes('id="user-content-'+id+'"')?'href="#user-content-'+id+'"':attribute);
  for(const file of refs){
    const bytes=await fs.readFile(file);
    embedded=embedded.split('"'+file+'"').join('"data:'+mime(file)+';base64,'+bytes.toString('base64')+'"');
  }
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto('https://github.com/AyOuBzArO',{waitUntil:'domcontentloaded',timeout:45000});
  const styles=await page.locator('link[rel="stylesheet"]').evaluateAll(els=>[...new Set(els.map(e=>e.href).filter(url=>/^https?:/.test(url)))]);
  let css='';
  for(const url of styles){const r=await fetch(url);if(r.ok)css+='\n'+await r.text();}
  await fs.writeFile('preview/github.css',css);
  const html='<!doctype html><html lang="en" data-color-mode="dark" data-dark-theme="dark" data-light-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AyOuBzArO — README preview</title><link rel="stylesheet" href="github.css"><style>body{padding:32px 16px}.preview-shell{max-width:960px;margin:auto;border:1px solid var(--borderColor-default,#30363d);border-radius:8px;padding:32px;background:var(--bgColor-default,#0d1117)}@media(max-width:600px){body{padding:8px}.preview-shell{padding:16px}}</style></head><body><main class="preview-shell"><article class="markdown-body entry-content container-lg">'+embedded+'</article></main></body></html>';
  await fs.writeFile('preview/index.html',html);
  const results=[];
  for(const [name,width,mode] of [['desktop-dark',1440,'dark'],['narrow-dark',768,'dark'],['mobile-dark',390,'dark'],['small-mobile',320,'dark'],['desktop-light',1440,'light'],['mobile-light',390,'light']]){
    await page.setViewportSize({width,height:1000});
    await page.goto('file:///'+path.join(root,'preview/index.html').replace(/\\/g,'/'));
    await page.evaluate(mode=>document.documentElement.setAttribute('data-color-mode',mode),mode);
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
    await page.waitForTimeout(300);
    const report=await page.evaluate(()=>({
      viewport:innerWidth,document:document.documentElement.scrollWidth,
      brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.alt),
      selectedWorkTop:document.getElementById('user-content-selected-work')?.getBoundingClientRect().top,
      portraitBottom:document.querySelector('img[align=right]')?.getBoundingClientRect().bottom,
      diagramMobile:document.querySelector('picture img')?.currentSrc.startsWith('data:image/svg+xml')&&atob(document.querySelector('picture img').currentSrc.split(',')[1]).includes('height="692"'),
      missingAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id)&&!document.getElementById('user-content-'+id))
    }));
    results.push({name,...report});
    await page.screenshot({path:'preview/'+name+'.png',fullPage:true});
    if(width===1440&&mode==='dark')await page.screenshot({path:'preview/above-fold.png'});
  }
  // Sample the browser's CSS animation timeline; assert that every text box
  // remains at the same position and opacity throughout two complete loops.
  for(const file of ['siteguard-flow.svg','siteguard-flow-mobile.svg']){
    await page.setViewportSize({width:1000,height:800});
    await page.goto('file:///'+path.join(root,'assets/visuals',file).replace(/\\/g,'/'));
    await page.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));
    const getText=()=>page.locator('text').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent,x:r.x,y:r.y,w:r.width,h:r.height,opacity:getComputedStyle(el).opacity}}));
    const baseline=await getText();
    const states=[];
    for(let n=0;n<6;n++){
      await page.evaluate(t=>document.getAnimations().forEach(a=>a.currentTime=t),n*2000+100);
      const current=await getText();
      if(JSON.stringify(current)!==JSON.stringify(baseline))throw Error(file+': text moved during animation');
      states.push(await page.locator('.signal').first().evaluate(el=>({offset:getComputedStyle(el).strokeDashoffset,opacity:getComputedStyle(el).opacity})));
      await page.screenshot({path:'preview/'+file.replace('.svg','')+'-frame-'+n+'.png'});
    }
    if(new Set(states.map(s=>s.offset)).size<2)throw Error(file+': animation did not advance');
    await page.emulateMedia({reducedMotion:'reduce'});
    const reduced=await page.locator('.signal').first().evaluate(el=>getComputedStyle(el).animationName);
    if(reduced!=='none')throw Error(file+': reduced motion not honored');
    await page.emulateMedia({reducedMotion:'no-preference'});
    results.push({file,stableLabels:true,motionStates:states,reducedMotion:reduced});
  }
  await fs.writeFile('preview/verification.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();
  if(results.some(r=>r.brokenImages?.length||r.missingAnchors?.length||(r.document>r.viewport)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
