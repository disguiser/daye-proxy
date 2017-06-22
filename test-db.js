require('babel-core/register')({
    presets: ['stage-3']
});
// require('./httprequest');
const accounting = require('accounting-js');

console.log(accounting.formatMoney(100000, {symbol: "￥"}));

const nzhcn = require("nzh").cn

console.log(nzhcn.encodeB(100111));
