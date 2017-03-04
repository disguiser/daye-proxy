// 改变dom的事件函数
function changeJSFunc(obj, func_name){
    if($(obj).attr('processed')!='true'){
        var jsfun = $(obj).attr('href');
        var flow_list_id = jsfun.substring(jsfun.indexOf('"') + 1, jsfun.lastIndexOf('"'));
        $(obj).attr('href', "javascript:void(0);");
        $(obj).attr('onclick', func_name + "('" + flow_list_id + "', this)");
        $(obj).attr('processed','true');
    }
}