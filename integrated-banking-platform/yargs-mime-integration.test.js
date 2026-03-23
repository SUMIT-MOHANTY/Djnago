const assert = require('assert');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const mime = require('mime-types');

describe('Yargs and MIME Types Integration', () => {
  it('should correctly parse yargs arguments', () => {
    const argv = yargs(hideBin(['node', 'script.js', '--format', 'json']))
      .option('format', {
        alias: 'f',
        describe: 'Output format',
        choices: ['json', 'csv', 'xml'],
        demandOption: true
      })
      .argv;

    assert.strictEqual(argv.format, 'json');
    console.log('[integration-test] Yargs integration test passed');
  });

  it('should correctly determine MIME type from file extension', () => {
    assert.strictEqual(mime.lookup('test.json'), 'application/json');
    assert.strictEqual(mime.lookup('document.pdf'), 'application/pdf');
    assert.strictEqual(mime.lookup('unknown.xyz'), false);
    console.log('[integration-test] MIME types integration test passed');
  });

  it('should handle MIME charset lookup', () => {
    assert.strictEqual(mime.charset('text/html'), 'UTF-8');
    assert.strictEqual(mime.charset('application/octet-stream'), null);
    console.log('[integration-test] MIME charset test passed');
  });
});
