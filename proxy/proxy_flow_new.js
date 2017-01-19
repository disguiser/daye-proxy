var selects = [];

var jqueryselect = {};
jqueryselect.query = 'script';
jqueryselect.func = function (node) {
    
    var stm = node.createStream({ "outer" : true });

    var tag = '';

    stm.on('data', function(data) {
       tag += data;
    });

    stm.on('end', function() {
      if(tag.match(/^<script>[\s\S]*jQuery\(document\).ready[\s\S]*<\/script>$/)){
				// console.log('初始化运行!!!');
        stm.end(`
					<script type="text/javascript" src="/node/workflow_new.js"></script>
					<script type="text/javascript" src="/node/fileupload/jquery.fileupload.js"></script>
					<link rel="stylesheet" href="/node/fileupload/jquery.fileupload.css">
					<script type="text/javascript" src="/node/fileupload/jquery.ui.widget.js"></script>
					<script type="text/javascript" src="/node/fileupload/jquery.iframe-transport.js"></script>
				`);
			} else {
        stm.end(tag);
      }
    });
}

selects.push(jqueryselect);

module.exports = selects;