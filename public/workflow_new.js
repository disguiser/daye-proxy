$(function(){
    var urlParams = parseUrlParams();
    var flowid = urlParams.flowid;
    if (flowid == 'faca20a152f311e6892e184f32ca6bca') { // 贷款投资合同录入流程
        // 修改编辑按钮的点击函数
        $('#d71c3200555111e69b1eb888e3e688de').change(function(){
            $('.btn.btn-purple.btn-xs.mini.purple').each(function(){
                changeJSFunc(this, 'listEdit_faca20a152f311e6892e184f32ca6bca');
            });
        });
    } else if (flowid == 'tc539970ff0911e694b4005056a60fd8' || flowid == 'v4b02a4f3e8a11e6ac80184f32ca6bca' || flowid == 'wfee86703bb611e7ae5d000c294af360') { // 抵质押物录入流程 + 资产解押审批流程+ 放款审批流程(消费贷及房抵贷)
        var regitem_id;
        if (flowid == 'tc539970ff0911e694b4005056a60fd8') {
            regitem_id = $('#t7d2de5eff2c11e6b53c1c3e84e5807c').val();
        } else if (flowid == 'v4b02a4f3e8a11e6ac80184f32ca6bca') {
            regitem_id = $('#cbe6307761304df39f476bc1fc7088e7').val();
        }else if (flowid == 'wfee86703bb611e7ae5d000c294af360') {
            regitem_id = $('#t2481c3059e111e68f3bf0def1c335c3').val();
        }
        excelImport('', flowid, regitem_id);// func.js
        // var project_no;
        // var loop = setInterval(function(){
        //     if ($('.table.table-striped.table-bordered.table-hover.dataTable tbody tr td').size() > 0) {
        //         $('.table.table-striped.table-bordered.table-hover.dataTable tbody tr td').each(function(index, obj){
        //             if (project_name == $(obj).text()) {
        //                 project_no = $(obj).prev().text();
        //                 if (flowid == undefined || flowid == '' || project_no == undefined || project_no == '') {
        //                     return;
        //                 }
                        
        //             }
        //         });
        //         clearInterval(loop);
        //     }
        // });
    } else if (flowid == 'v7608f2e3e8811e688c2184f32ca6bca') { // 收款流程
        $('#controlContainer').append('<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="1000px" src="/x/intrustqlc/views/dy/printInNotice?itemid=' + urlParams.itemid + '&itemName=' + urlParams.itemName + '&flowname=' + urlParams.flowname + '&uuid=' + urlParams.uuid + '"></iframe>');
    } else if (flowid == 'v11a7d403e8611e6b07e184f32ca6bca') { // 付款流程
        $('#controlContainer').append('<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="1000px" src="/x/intrustqlc/views/dy/printPayNotice?itemid=' + urlParams.itemid + '&itemName=' + urlParams.itemName + '&flowname=' + urlParams.flowname + '&uuid=' + urlParams.uuid + '"></iframe>');
    }
});
// 代理编辑函数 贷款投资合同录入流程
function listEdit_faca20a152f311e6892e184f32ca6bca(flow_list_id,obj){
    $.when(modi_d71c3200555111e69b1eb888e3e688de(flow_list_id)).done(function(){
        $('#spanshow_u4a6b2cf96a711e69b3968f728cd3fe1').text($(obj).parent().next().children().html());
        // 读取字典id,到后台查找字典名称
        // $.get('/node/getDictName/'+ $('#u4a6b2cf96a711e69b3968f728cd3fe1').val(), function(data){
        // });
    });
}
