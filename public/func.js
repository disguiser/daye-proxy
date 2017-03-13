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