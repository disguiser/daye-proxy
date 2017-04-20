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
function excelImport(flowid){
    $('#formContainer_d10b83b022552f1f1333eac162be2bb1f6f16c31').append('<div class="row-fluid"><div class="span6"><button type="button" id="excelImport" class="btn bule">excel导入</button></div></div>');
    $('#excelImport').click(function(){
        $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c .modal-header h1').text('excel导入');
        $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c .modal-footer').hide();
        $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c .modal-body').html('<iframe id="theIframe" name="theIframe" width="100%" height="500px" frameborder="0" src="/node/grid/grid.html?flow_id=' + flowid + '&type=import"></iframe>');
        $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c').modal('show');
    });    
}