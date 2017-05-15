const rp = require('request-promise');
const cheerio = require('cheerio');

(async () => {
    let html = await rp(`https://cnodejs.org/`);
    let $ = cheerio(html);
    console.log(html);
})();