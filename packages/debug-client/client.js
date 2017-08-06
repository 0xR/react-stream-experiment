import { get } from 'http';
import { promisify } from 'util';

function toMillis(hrtime) {
  const [seconds, nanos] = hrtime;
  return (seconds * 1e9 + nanos) / 1e6;
}

function prettyMillis(millis) {
  return `${millis.toFixed(1)}ms`;
}
function prettyPercent(percentage) {
  return `${percentage.toFixed(1)}%`;
}

async function doRequest(url) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    let ttfb;
    get(url, res => {
      res.on('data', data => {
        if (!ttfb) {
          ttfb = toMillis(process.hrtime(start));
        }
      });
      res.on('end', () => {
        const totalTime = toMillis(process.hrtime(start));
        resolve([ttfb, totalTime]);
      });
      res.on('error', reject);
    });
  });
}

const promiseSerial = funcs =>
  funcs.reduce(
    (promise, func) =>
      promise.then(results => func().then(result => results.concat([result]))),
    Promise.resolve([]),
  );

async function doSample(url) {
  const samplecount = 10;

  const sample = await promiseSerial(
    new Array(samplecount).fill(null).map(() => () => {
      return doRequest(url);
    }),
  );

  const sampleWithPercentage = sample.map(([ttfb, totalTime]) => [
    prettyMillis(ttfb),
    prettyMillis(totalTime),
    prettyPercent(ttfb / totalTime * 100),
  ]);

  console.log(sampleWithPercentage);
}

async function runExperiment() {
  console.log('sampling react 16 streaming')
  await doSample('http://localhost:3000/async');
  console.log('sampling react 16 sync')
  await doSample('http://localhost:3000/sync');
  console.log('sampling react 15 sync')
  await doSample('http://localhost:3001/');
}

runExperiment().catch(e => console.error(e));
