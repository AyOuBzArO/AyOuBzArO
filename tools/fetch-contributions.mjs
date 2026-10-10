import fs from 'node:fs/promises';

// Read only the unauthenticated public profile calendar. No token is used.
const source = 'https://github.com/users/AyOuBzArO/contributions';
const response = await fetch(source, {headers: {'User-Agent': 'AyOuBzArO-profile'}});
if (!response.ok) throw new Error(`Public contribution calendar: HTTP ${response.status}`);
const html = await response.text();
const tooltips = new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(([, attrs, body]) => [attrs.match(/\bfor="([^"]+)"/)?.[1], body.replace(/<[^>]+>/g, '').trim()]));
const days = [...html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)].map(([, attrs]) => {
  const get = name => attrs.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
  const label = tooltips.get(get('id'));
  const count = label?.match(/^(No|[\d,]+) contributions? on /)?.[1];
  if (!count) throw new Error('Could not parse contribution count for ' + get('data-date'));
  return {date: get('data-date'), count: count === 'No' ? 0 : Number(count.replaceAll(',', '')), level: Number(get('data-level'))};
}).sort((a, b) => a.date.localeCompare(b.date));
if (days.length < 350 || days.length > 378 || new Set(days.map(d => d.date)).size !== days.length) throw new Error('Unexpected calendar coverage');
days.forEach((day, i) => {
  if (!Number.isInteger(day.count) || day.count < 0 || day.level < 0 || day.level > 4) throw new Error('Invalid day');
  if (i && Date.parse(day.date) - Date.parse(days[i - 1].date) !== 86400000) throw new Error('Calendar is not contiguous');
});
const snapshot = {fetchedAt: new Date().toISOString(), source, scope: 'Daily counts visible on the public GitHub profile; these are contributions, not just commits.', from: days[0].date, to: days.at(-1).date, total: days.reduce((sum, d) => sum + d.count, 0), days};
await fs.writeFile('assets/data/github-contributions.json', JSON.stringify(snapshot, null, 2) + '\n');
await fs.writeFile('assets/data/github-contributions.md', `# Contribution calendar\n\nUpdated: ${snapshot.fetchedAt}\n\n${snapshot.scope}\n\nPeriod: ${snapshot.from} to ${snapshot.to}. Total: ${snapshot.total}.\n\nSource: [Public GitHub calendar](${source}).\n\n| Date | Contributions |\n| --- | ---: |\n${days.map(d => `| ${d.date} | ${d.count} |`).join('\n')}\n`);
console.log(`Saved ${days.length} days, ${snapshot.total} public-profile contributions (${snapshot.from} to ${snapshot.to}).`);
