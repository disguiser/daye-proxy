// 流程新建界面
function modelShowAfter(){
    // 对话框是点击后渲染,要篡改内容需渲染后执行
    if($('#new_or_edit').val()=='edit' || $('#div_mdform_x7857b1e3ebc11e68228184f32ca6bca').html()==""){
        $.when(modi_x7857b1e3ebc11e68228184f32ca6bca('')).done(function(){
            $.get('/node/attachments/0',function(data){
                bindingUpload(data);
                $('#new_or_edit').val('new');
            });
        });
    } else {
        $('#div_modal_x7857b1e3ebc11e68228184f32ca6bca').modal('show');
    }
    // table里添加列
    //$('#childObjTable_x7857b1e3ebc11e68228184f32ca6bca tbody tr td:eq(1)').html('<a>'+$('#childObjTable_x7857b1e3ebc11e68228184f32ca6bca tbody tr td:eq(1)').html()+'</a>');
}
// 绑定上传功能
function bindingUpload(data){
    $('#divControlContainer_x7857b1e3ebc11e68228184f32ca6bca').append(data);
    // 同步temp_id过来
    $('#another_temp_id').val($('#temp_id').val());
    // 页面唯一值
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
                    $('#node_ul_uploads').append('<li id="'+attachment.id+'"><a href="/node/download/'+attachment.id+'">'+attachment.file_name+'</a> <i class="icon-trash" onclick="javascript:delAttachment(this);"></i></li>');
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
$(function(){
    $('.btn.blue.mini').attr('href','javascript:modelShowAfter();');
    $('#theform .row-fluid:last').html('<input type="hidden" id="temp_id" />');
    $('#temp_id').val(UUID.prototype.createUUID());
    // 附件list内容发生变化则清空对话框
    $('#x7857b1e3ebc11e68228184f32ca6bca').change(function(){
        $('#div_mdform_x7857b1e3ebc11e68228184f32ca6bca').html('');
        // 并修改编辑按钮的点击函数
        $('.btn.btn-purple.btn-xs.mini.purple').each(function(){
            changeJSFunc(this, 'listEdit');
        });
        // 以及删除函数的点击函数
        $('.btn.btn-grey.btn-xs.mini.black').each(function(){
            changeJSFunc(this, 'listDelete');
        });
    });
});
// 改变dom的事件函数
function changeJSFunc(obj, func_name){
    if($(obj).attr('processed')!='true'){
        var jsfun = $(obj).attr('href');
        var flow_list_id = jsfun.substring(jsfun.indexOf('"') + 1, jsfun.lastIndexOf('"'));
        $(obj).attr('href', "javascript:"+ func_name +"('"+flow_list_id+"')")
        $(obj).attr('processed','true');
    }
}
// 劫持编辑函数
function listEdit(flow_list_id){
    $.when(modi_x7857b1e3ebc11e68228184f32ca6bca(flow_list_id)).done(function(){
        $.get('/node/attachments/'+flow_list_id,function(data){
            bindingUpload(data);
            $('#new_or_edit').val('edit');
        });
    });
}
// 劫持删除函数
function listDelete(flow_list_id){
    $.get('/node/delete_by_fli/'+flow_list_id,function(data){
        del_x7857b1e3ebc11e68228184f32ca6bca(flow_list_id);
    });
}
window.onbeforeunload=function(){
    // console.log('离开了!');
    // $.getJSON('/node/delete_by_ti/'+$('#temp_id').val(),function(){
    //     console.log('已删除');
    // });
};

function delAttachment(obj){
    if(confirm('确认删除?')){
        $.getJSON('/node/delete_by_id/'+obj.parentElement.id, function(data){
            if(data.result == 'successed') {
                alert('删除成功!');
                $('#'+obj.parentElement.id).remove();
            } else {
                alert('删除失败!');
            }
        });
    }
}