// 流程新建界面
function listAdd(){
    // 对话框是点击后渲染,要篡改内容需渲染后执行
    if($('#new_or_edit').val()=='edit' || $('#div_mdform_' + dict['prp_id']).html()==""){
        eval('modi_' + dict['prp_id'] + '("")');
        $.get('/node/attachments/0',function(data){
            bindingUpload(data);
            $('#new_or_edit').val('new');
        });
    } else {
        $('#div_modal_' + dict['prp_id']).modal('show');
    }
}
// 绑定上传功能
function bindingUpload(data){
    var loop = setInterval(function(){
        var divControlContainer = $('#divControlContainer_' + dict['prp_id']);
        if (divControlContainer.size() !== 0) {
            divControlContainer.append(data);
            // 同步temp_id过来
            $('#another_temp_id').val($('#temp_id').val());
            // 页面唯一值 随着流程提交被保存到json内
            $('#flow_list_id').val($('#LIST_UUID').val());
            // 不能校验文件上传的form
            $("#fileuploadForm").validate({
                ignore:".ignore"
            })
            // 上传方法绑定
            $('#fileuploadForm').fileupload({
                url: '/node/upload',
                dataType: 'json',
                done: function(e, data) {
                    var attachments = data.result;
                    if(attachments instanceof Array){
                        for (let attachment of attachments) {
                            $('#node_ul_uploads').append('<li><a id="'+attachment.id+'" href="/node/download/'+attachment.id+'">' + attachment.file_name + '(' + attachment.file_size + ' ' + attachment.upload_time + ')' +'</a> <i class="icon-trash" id="'+attachment.id+'" onclick="javascript:delAttachment(this);"></i></li>');
                        }
                        $('#upload_progress').html('');
                    } else {
                        $('#upload_progress').html('上传失败');
                    }
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#upload_progress').html(progress + '%');
                }
            }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
        }
        clearInterval(loop);
    }, 1000);
}
var flowid,dict;
$(function(){
    flowid = parseUrlParams().flowid;
    flowid = flowid !== undefined ? flowid : $('#auth_flow_id').val();
    dict = {
        // 合同审批流程
        'afad680f3ec711e6ae92184f32ca6bca': {
            prp_id: 'x7857b1e3ebc11e68228184f32ca6bca'
        },
        // 合同审批流程(非实质性变更)
        'd70e099e240411e7a3af005056a687a8': {
            prp_id: 'w7824b2650e711e79fa3000c294af360'
        },
        // 资产解押审批流程
        'v4b02a4f3e8a11e6ac80184f32ca6bca': {
            prp_id: 'fa9185803e9c11e68dd0184f32ca6bca'
        }
    }
    dict = dict[flowid];
    App.init(); // initlayout and core plugins
    if (jQuery.isFunction(window.PageInit)) {PageInit()}
    if(jQuery('.brandp').length>0){
        var brandp = jQuery('.brandp');
        if(brandp.height()>20){
            brandp.css('margin-top','-7px');
        }else{
            brandp.css('margin-top','3px');
        }
    }
    $('#childObjTable_' + dict['prp_id'] + ' .btn.blue.mini').attr('href','javascript:listAdd();');
    $('body').append('<input type="hidden" id="temp_id" /><input id="new_or_edit" type="hidden" />');
    // 用于批量下载
    if ($('#' + dict['prp_id']).val() !== '') {
        $.ajax({
            type: 'get',
            url: '/node/getTempId',
            data: {flow_list_id: JSON.parse($('#' + dict['prp_id']).val())[0]['LIST_UUID']},
            async: false
        }).done(function(data){
            if (data.success != undefined) {
                $('#temp_id').val(data.success);
            }
        });
    } else {
        $('#temp_id').val(UUID.prototype.createUUID());
    }
    // 附件list内容发生变化则清空对话框
    $('#' + dict['prp_id']).change(proxy_edit_delete);

    // 如果是编辑页面,可能预先存在数据
    if($('#' + dict['prp_id']).val()!=""){
        proxy_edit_delete();
    }
});
// 代理编辑函数
function listEdit(flow_list_id){
    eval('modi_' + dict['prp_id'] + '("' + flow_list_id + '")');
    $.get('/node/attachments/'+flow_list_id,function(data){
        bindingUpload(data);
        $('#new_or_edit').val('edit');
    });
}
// 代理删除函数
function listDelete(flow_list_id){
    $.get('/node/delete_by_fli/'+flow_list_id,function(data){
        eval('del_' + dict['prp_id'] + '("' + flow_list_id + '")');
    });
}
// window.onbeforeunload=function(){
//     console.log('离开了!');
//     $.getJSON('/node/delete_by_ti/'+$('#temp_id').val(),function(){
//         console.log('已删除');
//     });
// };

function proxy_edit_delete() {
    // $('#div_mdform_' + dict['prp_id']).html('');
    // 并修改编辑按钮的点击函数
    $('#childObjTable_' + dict['prp_id'] + ' .btn.btn-purple.btn-xs.mini.purple').each(function(){
        changeJSFunc(this, 'listEdit');
    });
    // 以及删除函数的点击函数
    $('#childObjTable_' + dict['prp_id'] + ' .btn.btn-grey.btn-xs.mini.black').each(function(){
        changeJSFunc(this, 'listDelete');
    });
}

function delAttachment(obj){
    if(confirm('确认删除?')){
        $.getJSON('/node/delete_by_id/'+obj.id, function(data){
            if(data.result == 'successed') {
                alert('删除成功!');
                $('#'+obj.id).parent().remove();
            } else {
                alert('删除失败!');
            }
        });
    }
}