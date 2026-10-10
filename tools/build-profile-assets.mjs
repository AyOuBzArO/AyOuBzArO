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

// Individual compact badges: original vector artwork and its colors are untouched.
await fs.mkdir('assets/stack-color',{recursive:true});
const stackNames=[['python','Python'],['fastapi','FastAPI'],['flask','Flask'],['postgresql','PostgreSQL'],['sqlite','SQLite'],['javascript','JavaScript'],['typescript','TypeScript'],['react','React'],['nextjs','Next.js'],['tailwindcss','Tailwind CSS'],['docker','Docker'],['git','Git'],['linux','Linux'],['stripe','Stripe']];
for(const [id,label] of stackNames){
  const svg=await fs.readFile('assets/stack-originals/'+id+'.svg','utf8');
  const image='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
  const plate=['flask','linux','nextjs','stripe'].includes(id)?rect(17,10,56,56,'#f8fafc',10):'';
  const asset='<svg xmlns="http://www.w3.org/2000/svg" width="90" height="94" viewBox="0 0 90 94" role="img"><title>'+label+'</title>'+rect(1,1,88,92,'#161b22',12)+'<rect x="1" y="1" width="88" height="92" rx="12" stroke="#30363d" fill="none"/>'+plate+'<image href="'+image+'" x="22" y="15" width="46" height="46" preserveAspectRatio="xMidYMid meet"/>'+text(45,81,label,11,'#e6edf3',500,'text-anchor="middle"')+'</svg>';
  await fs.writeFile('assets/stack-color/'+id+'.svg',asset);
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
const {buildActivityCharts}=await import('./build-activity-charts.mjs');
await buildActivityCharts(snapshot);
await fs.writeFile('assets/data/github-public.md',`# Public GitHub snapshot\n\nUpdated: ${snapshot.fetchedAt}\n\n${snapshot.scope}\n\n| Metric | Value |\n| --- | ---: |\n| Public repos | ${snapshot.publicRepos} |\n| Stars received | ${snapshot.stars} |\n| Followers | ${snapshot.followers} |\n\n| Language | Bytes | Share |\n| --- | ---: | ---: |\n${sorted.map(([l,b])=>`| ${l} | ${b} | ${(100*b/total).toFixed(1)}% |`).join('\n')}\n\nSource: [GitHub REST API](${snapshot.source}).\n\nIncluded projects:\n${snapshot.repositories.map(r=>`- [${r.name}](${r.url})`).join('\n')}\n`);
console.log(`Built project covers, original-color stack badges and colorful statistics (${snapshot.fetchedAt}).`);
