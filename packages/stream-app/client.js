import { get } from 'http';
import { promisify } from 'util';

function toMicros(hrtime) {
  const [seconds, nanos] = hrtime;
  return `${Math.round((seconds * 1e9 + nanos) / 1e3)}µs`;
}

async function doRequest() {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    let last;
    get('http://localhost:3000', res => {
      res.on('data', data => {
        const now = process.hrtime();
        const sinceLast = last ? `, +${toMicros(process.hrtime(last))}` : '';
        const time = `[${toMicros(process.hrtime(start))}${sinceLast}]`;
        last = now;
        console.log(time, data.toString('utf8'));
      });
      res.on('end', resolve);
      res.on('error', reject);
    });
  });
}

doRequest().catch(e => console.error(e));
