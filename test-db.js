require('babel-core/register')({
    presets: ['stage-3']
});

const upload = require('./controllers/upload.js');


console.log('init db ok.');
process.exit(0);
