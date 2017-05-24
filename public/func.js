// 改变dom的事件函数
function changeJSFunc(obj, func_name, flow_list_id){
    if($(obj).attr('processed')!='true'){
        var jsfun = $(obj).attr('href');
        var flow_row_id = jsfun.substring(jsfun.indexOf('"') + 1, jsfun.lastIndexOf('"'));
        $(obj).attr('href', "javascript:void(0);");
        $(obj).attr('onclick', func_name + "('" + flow_row_id + "', this, '" + flow_list_id + "')");
        $(obj).attr('processed','true');
    }
}
// 覆盖错误内容
function doCoverWrongText(jqobj, json){
    if (typeof json == 'object' ) {
        jqobj.text(json[jqobj.text()]);
    }
}
// excel导入
function excelImport(affa_id, flow_id, regitem_id){
    regitem_id = regitem_id === undefined ? '' : regitem_id;
    let loop = setInterval(function(){
        if ($('.form-horizontal.form-view').size() > 0) {
            $('.form-horizontal.form-view').append('<div class="row-fluid" ><div class="span6"><button type="button" id="excelImport" class="btn bule">excel导入</button></div></div><div id="div_excelImport" style="display:none;" class="modal container fade" tabindex="-1" role="dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h3>excel导入</h3></div><div class="modal-body"><iframe id="theIframe" name="theIframe" width="100%" height="500px" frameborder="0" src="/node/grid/grid.html?affa_id='+ affa_id +'&flow_id=' + flow_id + '&regitem_id='+ regitem_id +'&type=import"></iframe></div></div>');
            $('#excelImport').click(function(){
                $('#div_excelImport').modal('show');
            });    
            clearInterval(loop);
        }
    }, 500);
}