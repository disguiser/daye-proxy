// 流程展示界面
$(function(){
    affaid = parseUrlParams().affaid;
    $.getJSON('/node/get_table/'+affaid, function(data){
        if(data.success != undefined){
            $('.detailinfo_ul_cont').html(data.success);
        }
    });
});