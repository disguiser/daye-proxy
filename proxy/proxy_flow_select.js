var selects = [];

var jqueryselect = {};
jqueryselect.query = 'script';
jqueryselect.func = function (node) {

  var out = `
      <script src="/static/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
      <script type="text/javascript" src="/node/workflow_select.js"></script>
      <script type="text/javascript" src="/node/func.js"></script>
    `;

  var stm = node.createStream({ "outer": true });

  var tag = '';

  stm.on('data', function (data) {
    tag += data;
  });

  stm.on('end', function () {
    if (tag.match(/^<script[\s\S]*\/jquery-1.10.2.min.js"[\s\S]*<\/script>$/)) {
      stm.end(out);
    } else {
      stm.end(tag);
    }
  });
}

selects.push(jqueryselect);

module.exports = selects;