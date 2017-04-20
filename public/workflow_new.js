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
    } else if (flowid == 'tc539970ff0911e694b4005056a60fd8') { // 抵质押物录入流程
        $('.btn.blue.mini').attr('href','javascript:listAdd_tc539970ff0911e694b4005056a60fd8();');
        excelImport(flowid);// func.js
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
// 抵质押物录入流程 过滤担保合同编号为当前项目编号下的
function listAdd_tc539970ff0911e694b4005056a60fd8(){
    $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c .modal-footer').show();
    $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c .modal-body').html('');
    $.when(modi_tc6b9900ff2f11e6bcbd1c3e84e5807c('')).done(function(){
        $.get('/node/getContractId/' + parseUrlParams().itemid, function(data){
            // console.log(data);
            $('#uc4c1991020811e789ba1c3e84e5807c option').each(function(){
                if(data.indexOf($(this).val())<0){
                    $(this).remove();
                }
            });
        });
    });
    // if(new_or_edit = 'new'){
    // } else {
    //     $('#div_modal_tc6b9900ff2f11e6bcbd1c3e84e5807c').modal('show');
    // }
}
