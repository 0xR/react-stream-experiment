const { writeFile: cbWriteFile } = require('fs');
const { promisify } = require('util');
const { spawn } = require('child_process');

const writeFile = promisify(cbWriteFile);

const rampDuration = 60;
const rampRate = 20;
const rampCount = 4;

function createConfig({ target, url }) {
  return {
    config: {
      target,
      phases: new Array(rampCount)
        .fill(rampRate)
        .map((rate, i) => (i + 1) * rate)
        .map(arrivalRate => ({
          name: `${rampDuration} seconds @ ${arrivalRate} requests / second`,
          duration: rampDuration,
          arrivalRate,
        })),
    },
    scenarios: [
      {
        name: url,
        flow: [
          {
            get: {
              url,
            },
          },
        ],
      },
    ],
  };
}

async function writeConfig({ config, name }) {
  const fileName = `configs/${name}.json`;
  await writeFile(fileName, JSON.stringify(config));
  return fileName;
}

async function runArtillery({ configFileName }) {
  return new Promise(resolve => {
    console.log('running', configFileName);
    const artilleryProcess = spawn('./node_modules/.bin/artillery', [
      'run',
      configFileName,
      '-o',
      configFileName.replace('config', 'result'),
    ]);
    artilleryProcess.stdout.on('data', data => {
      console.log(data.toString());
    });

    artilleryProcess.stderr.on('data', data => {
      console.error(data.toString());
    });
    artilleryProcess.on('exit', resolve);
  });
}

async function writeConfigs() {
  return Promise.all([
    writeConfig({
      config: createConfig({
        target: 'http://localhost:3000',
        url: '/async',
      }),
      name: '16-async',
    }),
    writeConfig({
      config: createConfig({
        target: 'http://localhost:3000',
        url: '/sync',
      }),
      name: '16-sync',
    }),
    // writeConfig({
    //   config: createConfig({
    //     target: 'http://localhost:3001',
    //     url: '/',
    //   }),
    //   name: '15-sync',
    // }),
  ]);
}

const promiseSerial = funcs =>
  funcs.reduce(
    (promise, func) =>
      promise.then(results => func().then(result => results.concat([result]))),
    Promise.resolve([]),
  );

async function loadTest() {
  await promiseSerial(
    (await writeConfigs()).map(configFileName => () =>
      runArtillery({ configFileName }),
    ),
  );
}

loadTest();
