import fs from 'node:fs/promises';
const revision='7330accdbc47e2dc0c19789a48533c4a3c50fe58';
const names=['python','fastapi','flask','postgresql','sqlite','javascript','typescript','react','nextjs','tailwindcss','docker','git','linux'];
await fs.mkdir('assets/stack-originals',{recursive:true});
const sources=[];
for(const name of names){
  const url=`https://raw.githubusercontent.com/devicons/devicon/${revision}/icons/${name}/${name}-original.svg`;
  const r=await fetch(url);if(!r.ok)throw Error(`${name}: ${r.status}`);
  const svg=await r.text();if(!svg.includes('<svg'))throw Error(`${name}: not SVG`);
  await fs.writeFile(`assets/stack-originals/${name}.svg`,svg);
  sources.push({name,url});
}
const license=await fetch(`https://raw.githubusercontent.com/devicons/devicon/${revision}/LICENSE`);
if(!license.ok)throw Error('Devicon license fetch failed');
await fs.writeFile('assets/stack-originals/LICENSE-devicon.txt',await license.text());
const externalSources=[{
  name:'stripe',
  url:'https://assets.stripeassets.com/fzn2n1nzq965/7q0dJGs6fRS1LRmMpChoAF/87def4edfbb7fd5aef4ab9baf904b2db/Stripe_logo_kit.zip',
  entry:'asset-wordmark/Stripe wordmark - Blurple.svg',
  note:'Official Stripe logo kit; retained in its original Blurple color.'
}];
await fs.writeFile('assets/stack-originals/sources.json',JSON.stringify({revision,note:'Original SVG artwork and colors retained. Devicon is a community-maintained brand icon collection, not an endorsement by the brands.',sources,externalSources},null,2)+'\n');
console.log('Downloaded 13 original-color SVGs and their license. Stripe is sourced separately from its official logo kit.');
