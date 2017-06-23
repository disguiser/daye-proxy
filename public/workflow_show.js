// 流程展示界面
$(function(){
    $('.col-sm-12').css('width','100%');
    // 去掉表单内的超链接
    var count = 0;
    var loop = setInterval(function(){
        if ($('.portlet span a').size() > 0) {
            $('.portlet span a').each(function(index, element){
                console.log($(element).parent().html());
                console.log($(element).text());
                $(element).parent().html($(element).text());
            });
            clearInterval(loop);
        }
        if (count == 10) {
            clearInterval(loop);
        }
        count ++;
    }, 1000);
    var urlParams = parseUrlParams();
    var affaid = urlParams.affaid,
        taskid = urlParams.taskid,
        flowname = $('.detailinfo_title').text();
        // flowid = $('#auth_flow_id').val();
    var url;
    // 需要往正文插入内容的流程
    var zw_flownames = [
        '合同审批流程','合同审批流程(非实质性变更)','产品发行流程','项目签报审批流程','项目审批流程','收款流程','付款流程',
        '放款审批流程','销户流程', '账户开户流程','收支计划审批流程','工作计划审批流程','信息披露(季度管理报告)审批流程',
        '放款审批流程(证券投资)','放款审批流程(消费贷及房抵贷)','项目签报变更流程','中后期重大事项签报流程', '外派人员（含董监事）委派审批流程',
        '外派人员行使表决权审批流程','资产解押审批流程','受益权转让审批流程','信托资金/销售资金监管使用申请流程'
    ];
    var excel_flownames = [
        '抵质押物录入流程','资产解押审批流程','放款审批流程(消费贷及房抵贷)'
    ];
    var regitem_flownames = [
        '项目审批流程', '项目签报审批流程'
    ];
    if (zw_flownames.indexOf(flowname) >= 0) {
        if(affaid != undefined){
            url = '/node/flow_show_affa/'+affaid;
        } else if(taskid != undefined){
            url = '/node/flow_show_task/'+taskid
        } else {
            return;
        }
        $.getJSON(url, function(data){
            if(data.success != undefined){
                $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').html(data.success);
                if ($('.detailinfo_ul li:nth-child(2) div:nth-child(2) table').size()) {
                    $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').css('text-align', 'center');
                }
                // $('.detailinfo_ul_cont').html(data.success);
                // 如果是iframe,隐藏内部按钮
                // var noticeIframe = document.getElementById('noticeIframe');
                // if(noticeIframe != null){
                //     noticeIframe.onload = noticeIframe.onreadystatechange = function() {
                //         if (this.readyState && this.readyState != 'complete') return;
                //         else {
                //             document.getElementById('noticeIframe').contentWindow.document.querySelector('button.editor').style.display='none';
                //         }
                //     }
                // }
            }
        });
    } 
    if (excel_flownames.indexOf(flowname) >= 0) {
        var url;
        if (taskid !== undefined) {
            url = '/node/affa_task/' + taskid;
        } else if (affaid !== undefined) {
            url = '/node/affa_affa/' + affaid;
        } else {
            return;
        }
        $.getJSON(url, function(data){
            if (data.affa_id !== undefined) {
                createExcelPage(data.flow_id, data.affa_id);
            }
        });
    }
    if (regitem_flownames.indexOf(flowname) >= -1) {
        var url;
        if (taskid !== undefined) {
            url = '/node/regitemid_taskid/' + taskid;
        } else if (affaid !== undefined) {
            url = '/node/regitemid_affaid/' + affaid;
        } else {
            return;
        }
        $.getJSON(url, function(data){
            if (data !== undefined) {
                $('.detailchoiceleft').append(`<a href="/x/intrustqlc/views/lifecycleDy_ALL?clsid=fb33464f48b911e6b8d8d85de21f6642&id=${data}" target="_blank">关联流程</a>`);
            }
        });
    }
});

function createExcelPage(flowid, affaid) {
    // $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').append('<button type="button" id="excelImport" class="btn bule">查看excel导入信息</button>');
    $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').prepend('<button style="float:left" type="button" id="excelImport" class="btn bule">查看excel导入信息</button><div id="div_excelImport" class="modal container fade" tabindex="-1" role="dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h3>excel导入</h3></div><div class="modal-body"><iframe id="theIframe" name="theIframe" width="100%" height="500px" frameborder="0" src="/node/grid/grid.html?flow_id=' + flowid + '&affa_id=' + affaid + '&type=edit"></iframe></div></div>');
    $('#excelImport').click(function(){
        $('#div_excelImport').css('overflow', 'auto');
        $('#div_excelImport').css('top', '0');
        $('#div_excelImport .modal-header').css('padding', '0');
        $('#div_excelImport .modal-body').css('padding', '0');
        $('#div_excelImport').modal('show');
    });
}