var selects = [];
var bodyselect = {};

bodyselect.query = '.detailinfo_ul_title';

bodyselect.func = function (node) {
	
    var out = `
		<script type="text/javascript" src="/node/workflow_show.js"></script>
	`;
	
	var rs = node.createReadStream();
	var ws = node.createWriteStream({outer: false});
	
	// Read the node and put it back into our write stream, 
	// but don't end the write stream when the readStream is closed.
	rs.pipe(ws, {end: false});
	
	// When the read stream has ended, attach our style to the end
	rs.on('end', function(){
		// console.log('proxy_flow_show!!!!');
		ws.end(out);
	});
}
selects.push(bodyselect);

module.exports = selects;