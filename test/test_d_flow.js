const assert = require('assert');
const d_excel = require('../dao/d_excel');

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
            let excelImport = await d_excel.excelImport('121', [
                {col010:1},
                {col010:2}
            ]);
            console.log(excelImport[0].id);
            console.log(excelImport[0].col010);
            // assert.strictEqual(excelImport.id, 1);
        });

    });
});