$(function(){
    // 修改编辑按钮的点击函数
    $('#d71c3200555111e69b1eb888e3e688de').change(function(){
        $('.btn.btn-purple.btn-xs.mini.purple').each(function(){
            changeJSFunc(this, 'listEdit');
        });
    });
});
// 代理编辑函数
function listEdit(flow_list_id,obj){
    $.when(modi_d71c3200555111e69b1eb888e3e688de(flow_list_id)).done(function(){
        $('#spanshow_u4a6b2cf96a711e69b3968f728cd3fe1').text($(obj).parent().next().children().html());
        // 读取字典id,到后台查找字典名称
        // $.get('/node/getDictName/'+ $('#u4a6b2cf96a711e69b3968f728cd3fe1').val(), function(data){
        // });
    });
}