const nunjucks = require('nunjucks');
const moment = require('moment');
const accounting = require('accounting-js');
const nzhcn = require('nzh').cn;

function createEnv(path, opts) {
    let
        autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('templates', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

module.exports = createEnv('templates', {
    watch: true,
    noCache: true,
    autoescape: false,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        },
        is_string: function(obj) {
            return typeof obj == 'string'
        },
        dateFormat: str => {
            return str == undefined ? '' : moment(str.toString()).format('YYYY年MM月DD日');
        },
        moneyFormat: str => {
            return str == undefined ? '' : accounting.formatMoney(str, {symbol: "￥"});
        },
        moneyFormatC: str => {
            return str == undefined ? '' : nzhcn.toMoney(str, {outSymbol:false});
        }
    }
});