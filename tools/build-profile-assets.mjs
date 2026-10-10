import fs from 'node:fs/promises';

const out='assets/designed';
await fs.mkdir(out,{recursive:true});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const text=(x,y,s,size=18,color='#eee',weight=400,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" ${extra}>${esc(s)}</text>`;
const rect=(x,y,w,h,fill='#181a1d',r=12)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#383b40" fill="none"/>`;
const base=(w,h,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><style>text{font-family:Arial,Helvetica,sans-serif} .signal{fill:none;stroke:#eee;stroke-width:2;stroke-dasharray:16 84;animation:travel 5s ease-in-out infinite}@keyframes travel{0%{stroke-dashoffset:100;opacity:0}15%,80%{opacity:1}100%{stroke-dashoffset:-100;opacity:0}}@media(prefers-reduced-motion:reduce){.signal{animation:none;stroke-dasharray:none;opacity:.65}}</style>${rect(0,0,w,h,'#111315',18)}<rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="17.5" fill="none" stroke="#36393d"/>${body}</svg>`;
const save=(name,content)=>fs.writeFile(`${out}/${name}.svg`,content);
const data=async file=>`data:image/${file.endsWith('.png')?'png':'jpeg'};base64,${(await fs.readFile(file)).toString('base64')}`;

// Original logo images are embedded unchanged; only the surrounding layout is new.
for(const p of [
  {id:'novaquill',name:'NovaQuill',logo:'novaquill-logo.png',label:'SAAS / PUBLISHING',heading:'An idea. A book. A product.',sub:'Research, write, review and export.',tags:'FastAPI  /  PostgreSQL  /  Stripe',bg:'#f5f3f5'},
  {id:'siteguard',name:'SiteGuard AI',logo:'siteguard-ai-logo.png',label:'DEVELOPER TOOL / WEBSITE AUDITS',heading:'Find the issue. Keep the evidence.',sub:'Deterministic checks, AI-assisted guidance.',tags:'Flask  /  MySQL  /  Groq',bg:'#050516'},
  {id:'auto-rinta',name:'Auto Rinta Car',logo:'auto-rinta-car-logo.jpeg',label:'CLIENT WORK / CAR RENTAL',heading:'From the fleet to the customer.',sub:'A French and Arabic rental experience.',tags:'Flask  /  SQLAlchemy  /  JavaScript',bg:'#000'}
]){
  const uri=await data('assets/projects/'+p.logo);
  for(const mobile of [false,true]){
    const w=mobile?500:1000,h=mobile?340:240;
    let b='';
    if(mobile){
      b+=rect(22,22,128,112,p.bg,10)+`<image href="${uri}" x="28" y="28" width="116" height="100" preserveAspectRatio="xMidYMid meet"/>`;
      b+=text(170,66,p.name,25,'#fff',700)+text(170,94,p.id==='novaquill'?'Publishing SaaS':p.id==='siteguard'?'Website audits':'Car rental',16,'#acb0b5');
      b+=line(22,155,478,155)+text(22,190,p.label,11,'#b7bbc1',600,'letter-spacing="1.2"');
      b+=text(22,229,p.heading,24,'#fff',700)+text(22,261,p.sub,17,'#bbc0c6')+text(22,309,p.tags,15,'#9ba2ab');
    }else{
      b+=rect(18,18,230,204,p.bg,12)+`<image href="${uri}" x="36" y="32" width="194" height="176" preserveAspectRatio="xMidYMid meet"/>`;
      b+=text(284,49,p.label,12,'#b7bbc1',600,'letter-spacing="1.6"')+text(284,96,p.name,34,'#fff',700);
      b+=text(284,134,p.heading,22,'#e2e4e7',500)+text(284,165,p.sub,17,'#aeb3ba')+line(284,188,960,188)+text(284,216,p.tags,14,'#aeb3ba');
    }
    await save(`${p.id}-card${mobile?'-mobile':''}`,base(w,h,p.name+' — '+p.heading,b));
  }
}

// Brand color is limited to the icons. Shared typography and spacing replace tiles.
const groups=[
  {id:'backend',title:'Backend & data',note:'APIs, application logic and persistence',tools:[['python','Python','#75b5e4'],['fastapi','FastAPI','#2dd4bf'],['flask','Flask','#eee'],['postgresql','PostgreSQL','#7baad3'],['sqlite','SQLite','#78c6e8']]},
  {id:'interfaces',title:'Interfaces',note:'The parts people see, touch and navigate',tools:[['javascript','JavaScript','#f7df1e'],['typescript','TypeScript','#65a7eb'],['react','React','#61dafb'],['nextdotjs','Next.js','#eee'],['tailwindcss','Tailwind CSS','#38bdf8']]},
  {id:'delivery',title:'Delivery & integrations',note:'Shipping, version control and payments',tools:[['docker','Docker','#57adfa'],['git','Git','#f67863'],['linux','Linux','#eee'],['stripe','Stripe','#a5a0ff']]}
];
for(const group of groups){
  const paths=await Promise.all(group.tools.map(async([slug])=>{
    const raw=await fs.readFile(`assets/stack/${slug}.svg`,'utf8');
    return raw.match(/<path\b[^>]*\/>/g).join('');
  }));
  for(const mobile of [false,true]){
    const w=mobile?500:1000,h=mobile?330:176;
    let b=text(28,42,group.title,mobile?25:23,'#fff',700)+text(28,69,group.note,mobile?16:14,'#aeb3ba');
    if(!mobile)b+=line(345,26,345,150);
    group.tools.forEach(([slug,label,color],i)=>{
      const x=mobile?38+(i%3)*153:379+i*121,y=mobile?110+Math.floor(i/3)*106:44;
      b+=`<g transform="translate(${x} ${y}) scale(1.7)" fill="${color}">${paths[i]}</g>`;
      b+=text(x+20,y+65,label,mobile?16:14,'#e6e9ed',500,'text-anchor="middle"');
    });
    await save(`stack-${group.id}${mobile?'-mobile':''}`,base(w,h,group.title+': '+group.tools.map(t=>t[1]).join(', '),b));
  }
}

// A second concrete product diagram, with fixed labels and moving connectors only.
for(const mobile of [false,true]){
  const w=mobile?500:1000,h=mobile?650:324;
  let b=text(28,36,'INSIDE NOVAQUILL',12,'#aeb3ba',600,'letter-spacing="2"')+text(28,76,'From a topic to a finished ebook.',mobile?25:31,'#fff',700);
  const stages=[['Topic','Choose a niche'],['Research','Analyse the opportunity'],['Generate','Build the chapters'],['Review','Check the content'],['Export','PDF · DOCX · EPUB']];
  stages.forEach(([label,detail],i)=>{
    const x=mobile?28:28+i*190,y=mobile?108+i*98:131,bw=mobile?444:170,bh=mobile?74:104;
    if(i<4){
      const d=mobile?`M250 ${y+bh}V${y+98}`:`M${x+bw} ${y+52}H${x+190}`;
      b+=`<path d="${d}" fill="none" stroke="#555" stroke-width="2"/><path class="signal" pathLength="100" d="${d}" style="animation-delay:-${i}s"/>`;
    }
    b+=rect(x,y,bw,bh,i===4?'#eceff2':'#202327');
    b+=text(x+18,y+31,label,21,i===4?'#16191c':'#f1f3f5',700);
    b+=text(x+18,y+57,detail,mobile?17:13,i===4?'#4b5159':'#b9bfc7');
  });
  b+=text(28,h-25,'Accounts, subscriptions and plan limits surround the workflow.',mobile?14:16,'#aeb3ba');
  await save(`novaquill-flow${mobile?'-mobile':''}`,base(w,h,'NovaQuill: topic, research, generate, review, export',b));
}

// Public-only, reproducible snapshot. No tokens, private repositories or inferred totals.
const snapshotFile='assets/data/github-public.json';
let snapshot;
if(process.argv.includes('--refresh-stats')){
  const get=async url=>{const r=await fetch(url,{headers:{'User-Agent':'AyOuBzArO-profile','Accept':'application/vnd.github+json'}});if(!r.ok)throw Error(`${url}: HTTP ${r.status}`);return r.json()};
  const user=await get('https://api.github.com/users/AyOuBzArO');
  const repos=[];
  for(let page=1;;page++){
    const batch=await get(`https://api.github.com/users/AyOuBzArO/repos?type=owner&per_page=100&page=${page}`);
    repos.push(...batch.filter(r=>!r.private));if(batch.length<100)break;
  }
  const projects=repos.filter(r=>!r.fork&&r.name!==user.login);
  const languages={};
  for(const repo of projects){for(const [name,bytes] of Object.entries(await get(repo.languages_url)))languages[name]=(languages[name]||0)+bytes;}
  snapshot={fetchedAt:new Date().toISOString(),source:'https://api.github.com/users/AyOuBzArO',scope:'Public owned repositories. Language bytes exclude forks and the profile README repository; private work is not included.',publicRepos:repos.length,stars:repos.reduce((n,r)=>n+r.stargazers_count,0),followers:user.followers,repositories:projects.map(r=>({name:r.name,url:r.html_url})),languages};
  await fs.mkdir('assets/data',{recursive:true});await fs.writeFile(snapshotFile,JSON.stringify(snapshot,null,2)+'\n');
}else{snapshot=JSON.parse(await fs.readFile(snapshotFile,'utf8'));}
const sorted=Object.entries(snapshot.languages).sort((a,b)=>b[1]-a[1]);
const total=sorted.reduce((n,r)=>n+r[1],0);
const rows=sorted.length>6?[...sorted.slice(0,5),['Other',sorted.slice(5).reduce((n,r)=>n+r[1],0)]]:sorted;
for(const mobile of [false,true]){
  const w=mobile?500:1000,h=mobile?740:500;
  let b=text(28,37,'GITHUB / PUBLIC SNAPSHOT',12,'#aeb3ba',600,'letter-spacing="1.7"')+text(28,78,'A small window into my work.',mobile?26:32,'#fff',700);
  const metrics=[[snapshot.publicRepos,'Public repos'],[snapshot.stars,'Stars received'],[snapshot.followers,'Followers']];
  metrics.forEach(([v,label],i)=>{const x=28+i*(w-56)/3;b+=text(x,143,v,44,'#fff',700)+text(x,171,label,mobile?15:16,'#aeb3ba');});
  b+=line(28,198,w-28,198)+text(28,234,'Language mix',23,'#fff',700)+text(28,260,`Share of code bytes · ${snapshot.repositories.length} public project repositories`,mobile?14:16,'#aeb3ba');
  const bw=mobile?350:660,bx=mobile?28:215;
  rows.forEach(([label,bytes],i)=>{
    const pct=total?100*bytes/total:0,y=mobile?299+i*62:294+i*27;
    b+=text(28,y,label,16,'#d9dee5',500);
    const by=mobile?y+12:y-11;
    b+=rect(bx,by,bw,9,'#30343a',4)+rect(bx,by,bw*pct/100,9,i===0?'#f1f3f5':'#909aa6',4);
    b+=text(mobile?472:962,mobile?y+21:y,`${pct.toFixed(1)}%`,15,'#d9dee5',500,'text-anchor="end"');
  });
  b+=text(28,h-44,`Updated ${snapshot.fetchedAt.slice(0,10)} · Source: GitHub REST API`,mobile?13:14,'#aeb3ba');
  b+=text(28,h-21,'Excludes private work. Language share is not a skill rating.',mobile?13:14,'#aeb3ba');
  await save(`github-stats${mobile?'-mobile':''}`,base(w,h,`${snapshot.publicRepos} public repos, ${snapshot.stars} stars, ${snapshot.followers} followers. Language byte shares: ${rows.map(([l,b])=>`${l} ${(100*b/total).toFixed(1)}%`).join(', ')}. Snapshot ${snapshot.fetchedAt.slice(0,10)}.`,b));
}
await fs.writeFile('assets/data/github-public.md',`# Public GitHub snapshot\n\nUpdated: ${snapshot.fetchedAt}\n\n${snapshot.scope}\n\n| Metric | Value |\n| --- | ---: |\n| Public repos | ${snapshot.publicRepos} |\n| Stars received | ${snapshot.stars} |\n| Followers | ${snapshot.followers} |\n\n| Language | Bytes | Share |\n| --- | ---: | ---: |\n${sorted.map(([l,b])=>`| ${l} | ${b} | ${(100*b/total).toFixed(1)}% |`).join('\n')}\n\nSource: [GitHub REST API](${snapshot.source}).\n\nIncluded projects:\n${snapshot.repositories.map(r=>`- [${r.name}](${r.url})`).join('\n')}\n`);
console.log(`Built project covers, stack panels, NovaQuill diagrams and statistics (${snapshot.fetchedAt}).`);
