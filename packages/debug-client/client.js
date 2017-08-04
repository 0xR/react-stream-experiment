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
    prettyPercent(ttfb / totalTime * 100),
    prettyMillis(ttfb),
    prettyMillis(totalTime),
  ]);

  console.log(sampleWithPercentage);

  // for (let i = 0; i < samplecount; i++) {
  //   console.log(await doRequest('http://localhost:3000/sync'));
  // }
}

async function runExperiment() {
  await doSample('http://localhost:3000/async');
  await doSample('http://localhost:3000/sync');
}

runExperiment().catch(e => console.error(e));
