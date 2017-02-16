// 流程展示界面
$(function(){
    var affaid = parseUrlParams().affaid,
        taskid = parseUrlParams().taskid,
        flowid = $('#auth_flow_id').val();
    var url;
    if (flowid == 'afad680f3ec711e6ae92184f32ca6bca') {// 合同审批流程
        if(affaid != undefined){
            url = '/node/get_attatable_affa/'+affaid;
        } else if(taskid != undefined){
            url = '/node/get_attatable_task/'+taskid
        } else {
            return;
        }
    } else if(flowid == 'b395b7615f9811e6b480b888e3e688de') {// 产品发行流程
        if(affaid != undefined){
            url = '/node/get_fxtable_affa/'+affaid;
        } else if(taskid != undefined){
            url = '/node/get_fxtable_task/'+taskid
        } else {
            return;
        }
    } else if(flowid == 'qba4418052fc11e68f55184f32ca6bca') {// 项目签报审批流程
        if(taskid != undefined){
            url = '/node/get_no/'+taskid;
        }
    }
    $.getJSON(url, function(data){
        if(data.success != undefined){
            $('.detailinfo_ul_cont').html(data.success);
        }
    });
});