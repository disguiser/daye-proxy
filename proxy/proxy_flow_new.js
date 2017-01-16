var selects = [];
var bodyselect = {};

bodyselect.query = 'body';

bodyselect.func = function (node) {
	
    var out = `
		<script type="text/javascript" src="https://cdn.staticfile.org/nunjucks/3.0.0/nunjucks.min.js"></script>
		<script type="text/javascript" src="http://localhost:3000/workflow_new.js"></script>
		<script type="text/javascript" src="http://localhost:3000/jquery.fileupload.js"></script>
		<link rel="stylesheet" href="/x/intrustqlc/static/fileupload/jquery.fileupload.css">
		<script type="text/javascript" src="/x/intrustqlc/static/fileupload/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="/x/intrustqlc/static/fileupload/jquery.iframe-transport.js"></script>
	`;
	
	var rs = node.createReadStream();
	var ws = node.createWriteStream({outer: false});
	
	// Read the node and put it back into our write stream, 
	// but don't end the write stream when the readStream is closed.
	rs.pipe(ws, {end: false});
	
	// When the read stream has ended, attach our style to the end
	rs.on('end', function(){
		console.log('sbsbsb1111!!!!');
		ws.end(out);
	});
}
selects.push(bodyselect);

var scriptselect = {};

scriptselect.query = 'script';
scriptselect.func = function (node) {
    
    var stm = node.createStream({ "outer" : true });

    var tag = '';

    stm.on('data', function(data) {
       tag += data;
    });

    stm.on('end', function() {

      if(tag.match(/^<script [\S]*static\/plugins\/jquery-file-upload\/js\/jquery.fileupload.js"><\/script>$/)){
        stm.end('');
			} else {
        stm.end(tag);
      }
    });    
}

selects.push(scriptselect);

module.exports = selects;