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
});
