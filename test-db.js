require('babel-core/register')({
    presets: ['stage-3']
});
// require('./httprequest');
const moment = require('moment');

console.log(moment().format('YYYY-MM-DD hh:mm:ss'));

