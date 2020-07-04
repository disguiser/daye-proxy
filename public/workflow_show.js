// 流程展示界面
$(function(){
    $('.col-sm-12').css('width','100%');
    // 去掉表单内的超链接
    var count = 0;
    var loop = setInterval(function(){
        if ($('.portlet span a').size() > 0) {
            $('.portlet span a').each(function(index, element){
                // console.log($(element).parent().html());
                // console.log($(element).text());
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
        //flowname = $('.detailinfo_title').text();
        flowname = $('#main1a .span10.offset1.margin-bottom-20.margin-top-20.animated.rotateInUpRight p.text-center').text();
        flowname= flowname.replace(/\ +/g, "").replace(/[\r\n]/g,""); 
    var url;
    // 需要往正文插入内容的流程
    var zw_flownames = [
        '合同审批流程','合同审批流程(非实质性变更)','产品发行流程','项目签报审批流程','项目审批流程','收款流程','付款流程',
        '放款审批流程','销户流程', '账户开户流程','收支计划审批流程','工作计划审批流程','信息披露(季度管理报告)审批流程',
        '放款审批流程(证券投资)','放款审批流程(消费贷及房抵贷)','项目签报变更流程','中后期重大事项签报流程', '外派人员（含董监事）委派审批流程',
        '外派人员行使表决权审批流程','资产解押审批流程','受益权转让审批(单一)','信托资金/销售资金监管使用申请流程','信托业务章/印签使用审批流程',
        '用印审批流程','抵质押权利证书(证明)领用审批','信托合同交接记录(集合)','受益权转让审批(适用所有集合产品)','清算报告审批流程','信息披露流程',
        '信托收益账户变更流程','不良资产处置中介选聘审批流程','不良资产处置方案签报审批流程','不良资产处置重大事项签报审批流程',
        '不良资产处置信息汇报流程','营销费用结算流程','信托项目预审评审意见表决流程','信托项目终审评审意见书','产品发行流程(非事务)',
        '抵质押权利证书(证明)移交审批','中后期管理报告流程','中介机构（律师/审计/评估）聘用审批流程','他项权利证书（证明）交接流程','业务档案归档交接流程',
        '信托业务档案归档交接流程','客户评级及限额审批流程','客户集中度标准调整审批单','客户限额及集中度占用备案审批','信托登记审批流程'
    ];
    var excel_flownames = [
        '抵质押物录入流程','资产解押审批流程','放款审批流程(消费贷及房抵贷)','中后期管理计划审批流程'
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
                $('#main1a  .span10.offset1.margin-bottom-20.margin-top-20.animated.rotateInUpRight div:nth-child(3) div:nth-child(5)').html(data.success);
                if ($('#main1a  .span10.offset1.margin-bottom-20.margin-top-20.animated.rotateInUpRight div:nth-child(3) div:nth-child(5) table').size()) {
                    $('#main1a  .span10.offset1.margin-bottom-20.margin-top-20.animated.rotateInUpRight div:nth-child(3) div:nth-child(5)').css('text-align', 'center');
                }
                // $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').html(data.success);
                // if ($('.detailinfo_ul li:nth-child(2) div:nth-child(2) table').size()) {
                    // $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').css('text-align', 'center');
                // }
                if (excel_flownames.indexOf(flowname) >= 0) {
                    createExcelPage(taskid, affaid);
                }
            }
        });
    } else if (excel_flownames.indexOf(flowname) >= 0) {
        createExcelPage(taskid, affaid);
    }
    // var regitem_flownames = [
    //     '项目审批流程', '项目签报审批流程'
    // ];
    // if (regitem_flownames.indexOf(flowname) >= -1) {
    // }
    var url;
    var url1;
    var affatask;
    if (taskid !== undefined) {
        url = '/node/regitemid_taskid/' + taskid;
        url1 = '/node/find_affanumber_by_taskid/' + taskid;
        affatask = taskid;
        //$('.detailchoiceleft').append('<a href="/f/v/objlist?clsid=c342ec5eb7b711e69395005056ac2cf1&pagid=ba8d29c0a36411e795f3000c294af360&affa_id=' + taskid + '" target="_blank">关联流程</a>');
    } else if (affaid !== undefined) {
        url = '/node/regitemid_affaid/' + affaid;
        url1 = '/node/find_affanumber_by_affaid/' + affaid;
        affatask = affaid;
        //$('.detailchoiceleft').append('<a href="/x/intrustqlc/pdfsign/pdfcreate?affaid=' + affaid + '&fileName=' + flowname + '.pdf" >打印流程</a>');
         $('#promo_carousel .span5').append('<a class="btn btn-large detailchoiceright" /*style="width:64px;"*/ href="/x/intrustqlc/pdfsign/pdfcreate?affaid=' + affaid + '&fileName=' + flowname + '.pdf" >打印流程</a>  ');
    } else {
        return;
    }
    $.getJSON(url1, function(data){
        if (data>0) {
             $('#promo_carousel .span5').append('<a  class="btn btn-large detailchoiceright" style="width:64px;"  href="/f/v/objlist?clsid=c342ec5eb7b711e69395005056ac2cf1&pagid=ba8d29c0a36411e795f3000c294af360&affa_id=' + affatask + '" target="_blank">关联流程('+data.toString()+')</a>  ');
            //$('.detailchoiceleft').append('<a href="/f/v/objlist?clsid=c342ec5eb7b711e69395005056ac2cf1&pagid=ba8d29c0a36411e795f3000c294af360&affa_id=' + affatask + '" target="_blank">关联流程('+data.toString()+')</a>');
        }
    });
    $.getJSON(url, function(data){
        if (data !== undefined) {
            $('#promo_carousel .span5').append('<a  class="btn btn-large detailchoiceright" style="width:64px;"  href="/x/intrustqlc/views/lifecycleDy_ALL?clsid=fb33464f48b911e6b8d8d85de21f6642&id=' + data + '" target="_blank">全流程图</a>  ');
            //$('.detailchoiceleft').append('<a href="/x/intrustqlc/views/lifecycleDy_ALL?clsid=fb33464f48b911e6b8d8d85de21f6642&id=' + data + '" target="_blank">全流程图</a>');
        }
    });
});

function createExcelPage(taskid, affaid) {
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
            // createExcelPage(data.flow_id, data.affa_id);
            // $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').append('<button type="button" id="excelImport" class="btn bule">查看excel导入信息</button>');
            $('#main1a  .span10.offset1.margin-bottom-20.margin-top-20.animated.rotateInUpRight div:nth-child(3) div:nth-child(5)').prepend('<button style="float:left" type="button" id="excelImport" class="btn bule">查看excel导入信息</button><div id="div_excelImport" class="modal container hide fade in modal-overflow" tabindex="-1" role="dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h3>excel导入</h3></div><div class="modal-body"><iframe id="theIframe" name="theIframe" width="100%" height="500px" frameborder="0" src="/node/grid/grid.html?flow_id=' + data.flow_id + '&affa_id=' + data.affa_id + '&type=edit"></iframe></div></div>');
            //$('.detailinfo_ul li:nth-child(2) div:nth-child(2)').prepend('<button style="float:left" type="button" id="excelImport" class="btn bule">查看excel导入信息</button><div id="div_excelImport" class="modal container fade" tabindex="-1" role="dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h3>excel导入</h3></div><div class="modal-body"><iframe id="theIframe" name="theIframe" width="100%" height="500px" frameborder="0" src="/node/grid/grid.html?flow_id=' + data.flow_id + '&affa_id=' + data.affa_id + '&type=edit"></iframe></div></div>');
            $('#excelImport').click(function(){
                $('#div_excelImport').css('overflow', 'auto');
                //$('#div_excelImport').css('top', '0');
                $('#div_excelImport .modal-header').css('padding', '0');
                $('#div_excelImport .modal-body').css('padding', '0');
                $('#div_excelImport').modal('show');
            });
        }
    });
}