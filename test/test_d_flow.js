const assert = require('assert');
const d_flow = require('../dao/d_flow');

describe('#d_excel.js', () => {
    describe('#excelImport()', () => {
        before(function () {
            console.log('before:');
        });

        after(function () {
            console.log('after.');
        });

        beforeEach(function () {
            console.log('  beforeEach:');
        });

        afterEach(function () {
            console.log('  afterEach.');
        });

        it('#excelImport should return id', async () => {
            let affair = await d_flow.find_affar('s7332e6e241111e7a55b208984d80bae');
            console.log(affair);
            assert.strictEqual(affair, undefined);
        });

    });
});