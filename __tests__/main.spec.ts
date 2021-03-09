import { readFileSync, existsSync } from 'fs';
import * as nconf from 'nconf';
import { IntervalFactory } from '../src/logic/interval-factory';
import { IntervalMethodFactory } from '../src/logic/interval-methods/method-factory';
import { IntervalCheck, IntervalCheckMethod } from '../src/models/interval-check';

describe('basic test', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    jest.runOnlyPendingTimers();
  });

  // tslint:disable-next-line:mocha-unneeded-done
  test('expect true to be true', (done: any) => {
    expect(true).toBeTruthy();
    
    done();
  });

});

describe('test serialization', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    nconf.file({ file: './build/config.json' });
    jest.runOnlyPendingTimers();
  });

  // tslint:disable-next-line:mocha-unneeded-done
  test('expect to be able to deserialize api example', (done: any) => {
    let intervalChecksFolder: string = nconf.get('intervalChecksFolder');
    let apiExampleJson: string = readFileSync('./' + intervalChecksFolder + '/example-api.json', {
      encoding: 'utf8'
    });
    expect(apiExampleJson !== '').toBeTruthy();

    let intervalFactory: IntervalFactory = new IntervalFactory();
    let apiIntervalCheck: IntervalCheck = intervalFactory.buildIntervalCheck(apiExampleJson);
    expect(apiIntervalCheck).not.toBeNull();

    done();
  });
});