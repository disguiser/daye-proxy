// 对象id与存放对话框json数据的input标签的id的对应关系
var key_uuid = {
    // 机构
    c588f5c0c81311e68438005056a687a8: {
        listid: 'c588f5c2c81311e6aebf005056a687a8',
        RELATION_CUST_ID: 's642991e8e0111e69f6f68f728f28520'
    },
    // 个人
    v747d92ec81311e68aa0005056a687a8: {
        listid: 'pf114521087911e7a118005056a60fd8',
        RELATION_CUST_ID: 'xf3e56d6087811e792da005056a60fd8'
    }
}
var clsid = parseUrlParams().clsid;
var listid = key_uuid[clsid]['listid'];
$(function(){
    var loop = setInterval(function(){
        // table已经渲染生成, 再进行下一步操作
        if ($('.table.table-condensed.dataTable tbody tr').size() > 0) {
            // 监听存放json_data的dom数据变化
            $('#' + listid).change(function(){
                // 代理编辑按钮
                $('.table.table-condensed.dataTable tbody tr').each(function(index){
                    changeJSFunc($(this).find('.btn.btn-purple.btn-xs.mini.purple'), 'listEdit_' + clsid);
                });
            });
            if ($('#' + listid).val() != '') {
                $('#' + listid).trigger('change');
            }
            clearInterval(loop);
        }
    }, 1000);
});
function listEdit_v747d92ec81311e68aa0005056a687a8(flow_row_id, obj) {
    var fn = eval('modi_' + listid + '("' + flow_row_id + '")');
    $('#spanshow_' + key_uuid[clsid]['RELATION_CUST_ID']).text($(obj).parent().parent().find('td:eq(2)').text());
}
function listEdit_c588f5c0c81311e68438005056a687a8(flow_row_id, obj) {
    var fn = eval('modi_' + listid + '("' + flow_row_id + '")');
    $('#spanshow_' + key_uuid[clsid]['RELATION_CUST_ID']).text($(obj).parent().parent().find('td:eq(2)').text());
}