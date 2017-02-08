// 流程展示界面
$(function(){
    var affaid = parseUrlParams().affaid;
    var taskid = parseUrlParams().taskid;
    if(affaid != undefined){
        $.getJSON('/node/get_table/'+affaid, function(data){
            if(data.success != undefined){
                $('.detailinfo_ul_cont').html(data.success);
            }
        });
    }
    if(taskid != undefined){
        $.getJSON('/node/get_no/'+taskid, function(data){
            if(data.success != undefined){
                $('.detailinfo_ul_cont').html(data.success);
            }
        });
    }
});