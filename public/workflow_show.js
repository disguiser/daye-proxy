// 流程展示界面
$(function(){
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
        '合同审批流程','产品发行流程','项目签报审批流程','项目立项审批流程','收款流程','付款流程','放款审批流程', '销户流程', '账户开户流程','收支计划审批流程','工作计划审批流程'
    ];
    var excel_flownames = [
        '抵质押物录入流程'
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
    } else if (excel_flownames.indexOf(flowname) >= 0) {
        $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').append('<button type="button" id="excelImport" class="btn bule">查看excel导入信息</button>');
        $('#excelImport').click(function(){
            if ($('.modal.container.fade').size() === 0) {
                $('body').append(`
                    <div class="modal container fade" tabindex="-1" role="dialog" aria-hidden="false" style="margin-top: 0px; display: block;">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                            <h1></h1>
                        </div>
                        <div class="modal-body" id="div_mdform_tc6b9900ff2f11e6bcbd1c3e84e5807c"></div>
                    </div>
                `);
            }
            $('.modal.container.fade').css('overflow', 'auto');
            $('.modal.container.fade').css('top', '0');
            $('.modal.container.fade .modal-header').css('padding', '0');
            $('.modal.container.fade .modal-body').css('padding', '0');
            $('.modal.container.fade .modal-header h1').text('excel导入');
            $('.modal.container.fade .modal-footer').hide();
            $('.modal.container.fade .modal-body').html('<iframe id="theIframe" name="theIframe" width="100%" height="500px" frameborder="0" src="/node/grid/grid.html?flow_id=' + flow_name_key[flowname] + '&type=edit"></iframe>');
            $('.modal.container.fade').modal('show');
        });
    }
});
var flow_name_key = {
    抵质押物录入流程 : 'tc539970ff0911e694b4005056a60fd8'
}