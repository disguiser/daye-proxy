// 流程展示界面
$(function(){
    var affaid = parseUrlParams().affaid,
        taskid = parseUrlParams().taskid;
        // flowid = $('#auth_flow_id').val();
    var url;
    if(affaid != undefined){
        url = '/node/flow_show_affa/'+affaid;
    } else if(taskid != undefined){
        url = '/node/flow_show_task/'+taskid
    } else {
        return;
    }
    $.getJSON(url, function(data){
        if(data.success != undefined){
            $('.detailinfo_ul li:nth-child(2) div:nth-child(2) p').html(data.success);
            // $('.detailinfo_ul_cont').html(data.success);
        }
    });
});