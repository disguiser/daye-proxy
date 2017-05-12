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
        // 抵质押物录入
        if (data.flow_id === 'tc539970ff0911e694b4005056a60fd8' || data.flow_id === 'v4b02a4f3e8a11e6ac80184f32ca6bca') {
            excelImport(data.affa_id, data.flow_id);
        }
    });
});
