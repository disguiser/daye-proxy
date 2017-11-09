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
        } else if (['x353dfa173d311e6bab240f02f0658fc','rc3f698052f611e68138184f32ca6bca','s5a6a630766611e69f7640f02f0658fc','s5a6a630766611e69f7640f02f0658fc'].indexOf(data.flow_id) >= 0) {
            // 贷款投资合同录入流程 + 股权投资合同录入流程 + 非标金融资产投资类合同录入流程 + 其他投资类合同录入流程 + 其他投资类合同录入流程'faca20a152f311e6892e184f32ca6bca',
            var loop = setInterval(function(){
                if ($('#div_d668178052d011e6baafb888e3e688de label').size() > 0) {
                    $('#div_d668178052d011e6baafb888e3e688de label').html('<a style="color:#72ACE3" href="/f/v/objlist?clsid=c588f5c0c81311e68438005056a687a8&pagid=c588f606c81311e694c1005056a687a8" target="_blank">' + $('#div_d668178052d011e6baafb888e3e688de label').html() + '</a>');
                    clearInterval(loop);
                }
            }, 500);
            if (data.flow_id === 'faca20a152f311e6892e184f32ca6bca') {
                $('.btn.blue.mini').attr('href','javascript:listAdd();');
            }
        }
    });
});
function listAdd() {
    modi_d71c3200555111e69b1eb888e3e688de('');
    var loop = setInterval(function(){
        if ($('#div_u4a6b2cf96a711e69b3968f728cd3fe1 label').size() > 0) {
            $('#div_u4a6b2cf96a711e69b3968f728cd3fe1 label:eq(0)').html('<a style="color:#72ACE3" href="/f/v/objlist?clsid=c588f5c0c81311e68438005056a687a8&pagid=c588f606c81311e694c1005056a687a8" target="_blank">' + $('#div_u4a6b2cf96a711e69b3968f728cd3fe1 label').html() + '</a>');
            clearInterval(loop);
        }
    }, 500);
}