const archiver = require('archiver-promise');
 
const archive = archiver('D:/zip/a.zip',{
  store: false
  // more options https://archiverjs.com/docs/ 
});
 
 
// append a file 
archive.file('D:/zip/1.txt', { name: '1.txt' });
archive.file('D:/zip/2.txt', { name: '2.txt' });
 
// finalize the archive 
archive.finalize().then(function(){
  console.log('done');
});