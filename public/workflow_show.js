// 流程展示界面
var json_data;
$(function(){
    var affaid = parseUrlParams().affaid,
        taskid = parseUrlParams().taskid,
        flowname = $('.detailinfo_title').text();
        // flowid = $('#auth_flow_id').val();
    var url;
    // 需要往正文插入内容的流程
    var zw_flownames = [
        '合同审批流程','产品发行流程','项目签报审批流程','项目立项审批流程(合并)','收款流程','付款流程','放款审批流程'
    ];
    // 替换下拉选id为name的流程
    var select_flownames = [
        '项目签报变更流程','抵质押物录入流程'
    ];
    if (select_flownames.indexOf(flowname) >=0 ) {
        // 可能执行的时候dom还没渲染完成,这里加个轮询
        var loop = setInterval(function(){
            if($('#divVal_c832fa5170e311e68db8184f32ca6bca input:eq(0)').val()!=undefined){
                coverWrongText();
                clearInterval(loop);
            }
        },1000);
    } else if (zw_flownames.indexOf(flowname) >= 0) {
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
});
function coverWrongText(){
    json_data = JSON.parse($('#divVal_c832fa5170e311e68db8184f32ca6bca input:eq(0)').val());
    var chgdetail_id,
        select_json;
    $('.table.table-condensed.dataTable tbody tr').each(function(index, data){
        chgdetail_id = json_data[index]['CHGDETAIL_ID'];
        select_json = json_data[index][chgdetail_id];
        // 代理查看方法,用于往对话框里回写数据
        changeJSFunc($(data).find('td:eq(0) a'), 'listView');
        doCoverWrongText($(data).find('td:eq(1)'), select_json['field_name']);
        doCoverWrongText($(data).find('td:eq(2)'), select_json['val_before']);
        doCoverWrongText($(data).find('td:eq(3)'), select_json['val_after']);
        // 框架里认为json_data里的key都有对应dom,代理往里面存放了点别的内容,防止框架里的代码报错,这里添加一个无用的dom
        $('body').append('<input type="hidden" id="'+ chgdetail_id +'"/>');
    });
}
// 覆盖错误内容
function doCoverWrongText(jqobj, json){
    if(typeof json == 'object' ) {
        jqobj.text(json[jqobj.text()]);
    }
}
function listView(flow_list_id, obj){
    var fn = eval('view_' + $('#divVal_c832fa5170e311e68db8184f32ca6bca input:eq(0)').attr('id'));
    fn.call(flow_list_id);
    json_data.forEach(function(data, index){
        if(data['CHGDETAIL_ID']==flow_list_id){
            writeBack(data[flow_list_id], 'field_name');
            writeBack(data[flow_list_id], 'val_before');
            writeBack(data[flow_list_id], 'val_after');
        }
    });
    // var loop = setInterval(function(){
    //     if($('#' + key_uuid['field_name']).text() != undefined && $('#' + key_uuid['field_name']).text() != ''){
    //         clearInterval(loop);
    //     }
    // }, 1000);
}
function writeBack(json, key){
    if (typeof json[key]=='object') {
        $('#' + key_uuid[key]).text(Object.values(json[key])[0]);
    } else {
        $('#' + key_uuid[key]).text(json[key]);
    }
}