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
            $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').html(data.success);
            // $('.detailinfo_ul_cont').html(data.success);
            // 如果是iframe,隐藏内部按钮
            var noticeIframe = document.getElementById('noticeIframe');
            if(noticeIframe != null){
                noticeIframe.onload = noticeIframe.onreadystatechange = function() {
                    if (this.readyState && this.readyState != 'complete') return;
                    else {
                        document.getElementById('noticeIframe').contentWindow.document.querySelector('button.editor').style.display='none';
                    }
                }
            }
        }
    });
});