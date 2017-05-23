// 流程展示界面
$(function(){
    // 去掉表单内的超链接
    var count = 0;
    var loop = setInterval(function(){
        if ($('.table.table-condensed.dataTable tbody a:not(.btn)').size() > 0) {
            $('.table.table-condensed.dataTable tbody a:not(.btn)').each(function(index, element){
                $(element).parent().html($(element).text());
            });
            clearInterval(loop);
        }
        if (count == 10) {
            clearInterval(loop);
        }
        count ++;
    }, 1000);
    // excel导入
    var urlParams = parseUrlParams();
    var affaid = urlParams.affaid,
        taskid = urlParams.taskid;
    if(affaid != undefined){
        url = '/node/affa_affa/'+affaid;
    } else if(taskid != undefined){
        url = '/node/affa_task/'+taskid
    } else {
        return;
    }
    $.getJSON(url, function(data){
        // 抵质押物录入，资产解押审批流程，放款审批流程(消费贷及房抵贷)
        if (data.flow_id === 'tc539970ff0911e694b4005056a60fd8' || data.flow_id === 'v4b02a4f3e8a11e6ac80184f32ca6bca' || data.flow_id == 'wfee86703bb611e7ae5d000c294af360') {
            excelImport(data.affa_id, data.flow_id);
        } else if (data.flow_id === 'x353dfa173d311e6bab240f02f0658fc') {
            $('#div_d668178052d011e6baafb888e3e688de label').html('<a style="color:#72ACE3" href="/f/v/objlist?clsid=c588f5c0c81311e68438005056a687a8&pagid=c588f606c81311e694c1005056a687a8" target="_blank">' + $('#div_d668178052d011e6baafb888e3e688de label').html() + '</a>');
        }
    });
});
