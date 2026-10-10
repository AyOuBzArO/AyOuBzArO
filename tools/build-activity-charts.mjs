import fs from 'node:fs/promises';

const e = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const t = (x,y,s,size=16,fill='#e6edf3',weight=400,extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${e(s)}</text>`;
const r = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const languageColors = {Python:'#3572A5',TypeScript:'#3178c6',HTML:'#e34c26',JavaScript:'#f1e05a',CSS:'#b58ae8',Other:'#94a3b8'};
const heat = ['#222b35','#0e4429','#006d32','#26a641','#39d353'];
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const point = (cx,cy,radius,angle) => [cx+radius*Math.cos(angle),cy+radius*Math.sin(angle)];
function sector(cx,cy,outer,inner,start,end) {
  const a=point(cx,cy,outer,start),b=point(cx,cy,outer,end),c=point(cx,cy,inner,end),d=point(cx,cy,inner,start),large=end-start>Math.PI?1:0;
  return `M${a}A${outer},${outer} 0 ${large} 1 ${b}L${c}A${inner},${inner} 0 ${large} 0 ${d}Z`;
}

export async function buildActivityCharts(snapshot) {
  const calendar=JSON.parse(await fs.readFile('assets/data/github-contributions.json','utf8'));
  const total=Object.values(snapshot.languages).reduce((a,b)=>a+b,0);
  const sorted=Object.entries(snapshot.languages).sort((a,b)=>b[1]-a[1]);
  const rows=[...sorted.slice(0,5),['Other',sorted.slice(5).reduce((n,[,v])=>n+v,0)]].filter(([,v])=>v>0);
  const weeks=[];
  for(const day of calendar.days) {
    const weekday=new Date(day.date+'T00:00:00Z').getUTCDay();
    if(weekday===0 || !weeks.length) weeks.push([]);
    weeks.at(-1).push({...day,weekday});
  }
  if(calendar.days.reduce((n,d)=>n+d.count,0)!==calendar.total) throw new Error('Contribution sum mismatch');
  for(const mobile of [false,true]) {
    const width=mobile?500:1000,height=mobile?800:388;
    const lx=0,lw=mobile?500:362,lh=mobile?350:388,cx=mobile?0:380,cy=mobile?370:0,cw=mobile?500:620,ch=mobile?430:388;
    let body='';
    for(const [x,y,w,h] of [[lx,0,lw,lh],[cx,cy,cw,ch]]) body+=r(x+.5,y+.5,w-1,h-1,'#111820',18)+`<rect x="${x+.5}" y="${y+.5}" width="${w-1}" height="${h-1}" rx="18" fill="none" stroke="#2b3542"/>`;
    body+=t(24,34,'LANGUAGES',12,'#9aa9bb',600,'letter-spacing="1.8"')+t(24,62,'The code behind my projects',mobile?24:21,'#f0f6fc',600);
    const dx=mobile?136:181,dy=mobile?183:167,outer=mobile?89:76,inner=outer-22;
    let angle=-Math.PI/2;
    for(const [name,bytes] of rows) {
      const end=angle+2*Math.PI*bytes/total;
      body+=`<path d="${sector(dx,dy,outer,inner,angle,end)}" fill="${languageColors[name]||'#94a3b8'}"><title>${e(name)}: ${(100*bytes/total).toFixed(1)}%</title></path>`;
      angle=end;
    }
    body+=t(dx,dy+2,String(snapshot.repositories.length),34,'#f0f6fc',600,'text-anchor="middle"')+t(dx,dy+23,'public projects',12,'#9aa9bb',400,'text-anchor="middle"');
    rows.forEach(([name,bytes],i)=>{
      const x=mobile?260:24+(i%2)*164,y=mobile?117+i*33:276+Math.floor(i/2)*29;
      body+=r(x,y-9,7,7,languageColors[name]||'#94a3b8',2)+t(x+15,y,name,mobile?15:13,'#ccd6e3')+t(mobile?474:x+144,y,(100*bytes/total).toFixed(1)+'%',mobile?15:13,'#f0f6fc',600,'text-anchor="end"');
    });
    body+=t(24,lh-19,'Code bytes · '+snapshot.fetchedAt.slice(0,10),12,'#91a0b3');
    body+=t(cx+24,cy+34,'CONTRIBUTIONS',12,'#9aa9bb',600,'letter-spacing="1.8"')+t(cx+24,cy+64,calendar.total+' contributions over the past year',mobile?22:24,'#f0f6fc',600)+t(cx+24,cy+89,calendar.from+' — '+calendar.to,13,'#9aa9bb');
    const drawWeeks=(subset,startX,startY,step)=>{
      let bits='';
      [1,3,5].forEach((day,i)=>bits+=t(startX-9,startY+day*step+step-3,['Mon','Wed','Fri'][i],10,'#91a0b3',400,'text-anchor="end"'));
      let lastLabel=-100;
      subset.forEach((week,wi)=>{
        const firstOfMonth=week.find(d=>d.date.endsWith('-01'));
        if((wi===0 || firstOfMonth) && wi-lastLabel>=(mobile?2:3) && wi<subset.length-1) {
          const date=firstOfMonth?.date||week[0].date;
          bits+=t(startX+wi*step,startY-12,monthNames[Number(date.slice(5,7))-1],11,'#9aa9bb');lastLabel=wi;
        }
        week.forEach(d=>bits+=`<g><title>${d.date}: ${d.count} contributions</title>${r(startX+wi*step,startY+d.weekday*step,step-2.5,step-2.5,heat[d.level],2)}</g>`);
      });
      return bits;
    };
    if(mobile) {
      const split=Math.ceil(weeks.length/2);
      body+=drawWeeks(weeks.slice(0,split),56,cy+129,15.5)+drawWeeks(weeks.slice(split),56,cy+264,15.5);
    } else {
      body+=drawWeeks(weeks,cx+56,cy+164,10.15);
      body+=`<path d="M${cx+24} ${cy+277}H${cx+cw-24}" stroke="#27313e"/>`;
      body+=t(cx+24,cy+306,'Every square is one day.',15,'#ccd6e3')+t(cx+24,cy+332,'Activity recorded on my public GitHub profile.',13,'#91a0b3');
    }
    const legendY=cy+ch-21,legendX=cx+cw-160;
    body+=t(legendX-32,legendY,'Less',10,'#91a0b3');
    heat.forEach((color,i)=>body+=r(legendX+i*16,legendY-10,12,12,color,2));
    body+=t(legendX+85,legendY,'More',10,'#91a0b3');
    body+=t(cx+24,legendY,'Snapshot · '+calendar.fetchedAt.slice(0,10),11,'#91a0b3');
    const title=`Language share by public code bytes: ${rows.map(([n,v])=>n+' '+(100*v/total).toFixed(1)+'%').join(', ')}. ${calendar.total} contributions from ${calendar.from} to ${calendar.to}.`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${e(title)}</title><style>text{font-family:Arial,Helvetica,sans-serif;font-variant-numeric:tabular-nums}</style>${body}</svg>`;
    await fs.writeFile('assets/designed/github-stats'+(mobile?'-mobile':'')+'.svg',svg);
  }
}
