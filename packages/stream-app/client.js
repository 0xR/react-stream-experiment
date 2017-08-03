import { get } from 'http';
import { promisify } from 'util';

function toMillis(hrtime) {
  const [seconds, nanos] = hrtime;
  return `${((seconds * 1e9 + nanos) / 1e6).toFixed(1)}ms`;
}

async function doRequest() {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    let last;
    get('http://localhost:3000', res => {
      res.on('data', data => {
        const now = process.hrtime();
        const sinceLast = last ? `, +${toMillis(process.hrtime(last))}` : '';
        const time = `[${toMillis(process.hrtime(start))}${sinceLast}]`;
        last = now;
        console.log(time, data.length);
      });
      res.on('end', resolve);
      res.on('error', reject);
    });
  });
}

doRequest().catch(e => console.error(e));
