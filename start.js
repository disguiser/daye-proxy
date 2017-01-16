require('babel-core/register')({
    presets: ['stage-3']
});
require('./proxy.js');
require('./app.js');