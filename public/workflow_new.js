$(function(){
    var flowid = parseUrlParams().flowid;
    if (flowid == 'faca20a152f311e6892e184f32ca6bca') { // 贷款投资合同录入流程
        // 修改编辑按钮的点击函数
        $('#d71c3200555111e69b1eb888e3e688de').change(function(){
            $('.btn.btn-purple.btn-xs.mini.purple').each(function(){
                changeJSFunc(this, 'listEdit_faca20a152f311e6892e184f32ca6bca');
            });
        });
    } else if (flowid == 'o53659213e5c11e6a7bd184f32ca6bca') { // 项目签报变更流程
        $('.btn.blue.mini').attr('href','javascript:listAdd_o53659213e5c11e6a7bd184f32ca6bca();');
    } else if (flowid == 'tc539970ff0911e694b4005056a60fd8') { // 抵质押物录入流程
        $('.btn.blue.mini').attr('href','javascript:listAdd_tc539970ff0911e694b4005056a60fd8();');
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
// 全局变量 用于记录当前蓝色加号按钮是新增还是编辑 防止每次都渲染对话框
var new_or_edit = 'new';
// 代理新增函数 项目签报变更流程
function listAdd_o53659213e5c11e6a7bd184f32ca6bca(){
    if (new_or_edit == 'new') {
        $.when(modi_c832fa5170e311e68db8184f32ca6bca('')).done(function(){
            new_or_edit = 'edit';
            // 替换保存按钮的点击事件 
            $('#div_modal_c832fa5170e311e68db8184f32ca6bca .btn.blue').attr('onclick', 'save_o53659213e5c11e6a7bd184f32ca6bca();');
        });
    } else {
        $('#div_modal_c832fa5170e311e68db8184f32ca6bca').modal('show');
    }
}
var allSelectedDict = {};
// 代理保存函数 项目签报变更流程
function save_o53659213e5c11e6a7bd184f32ca6bca(){
    var selectedDict = {};
    // 修改要素
    selectedDict = saveDict(selectedDict, 'field_name');
    // 修改前
    selectedDict = saveDict(selectedDict, 'val_before');
    // 修改后 
    selectedDict = saveDict(selectedDict ,'val_after');

    var chgdetail_id = $('#CHGDETAIL_ID').val();

    allSelectedDict[chgdetail_id] = selectedDict;

    $.when(mdl_save_c832fa5170e311e68db8184f32ca6bca()).done(function(){
        new_or_edit = 'new';
        // 写到标签 用于提交时保存
        var json_data = JSON.parse($('#c832fa5170e311e68db8184f32ca6bca').val());
        json_data.forEach(function(data, index){
            if(data['CHGDETAIL_ID'] == chgdetail_id){
                data[chgdetail_id] = selectedDict;
            }
        });
        $('#c832fa5170e311e68db8184f32ca6bca').val(JSON.stringify(json_data));

        $('body').append('<input type="hidden" id="'+ chgdetail_id +'"/>');
        // 显示
        var key;
        $('#childObjTable_c832fa5170e311e68db8184f32ca6bca tbody tr').each(function(index){
            selectedDict = Object.values(allSelectedDict)[index];
            // 代理编辑按钮
            changeJSFunc($(this).find('.btn.btn-purple.btn-xs.mini.purple'), 'listEdit_o53659213e5c11e6a7bd184f32ca6bca');
            doCoverWrongText($(this).find('td:eq(1)'), selectedDict['field_name']);
            doCoverWrongText($(this).find('td:eq(2)'), selectedDict['val_before']);
            doCoverWrongText($(this).find('td:eq(3)'), selectedDict['val_after']);
        });
    });
}
// 将选中的下拉选内的key,value保存下来
function saveDict(selectedDict,key){
    if($('#' + key_uuid[key]).is('select')){
        var selectkey = $('#'+ key_uuid[key] +' option:selected').val();
        var value = $('#'+ key_uuid[key] +' option:selected').text();
        selectedDict[key] = {};
        selectedDict[key][selectkey] = value;
    } else {
        selectedDict[key] = $('#' + key_uuid[key]).val();
    }
    return selectedDict;
}
// 抵质押物录入流程 过滤担保合同编号为当前项目编号下的
function listAdd_tc539970ff0911e694b4005056a60fd8(){
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
// 代理编辑函数 项目签报变更流程 C770B065B960000179E83EF090C01462
function listEdit_o53659213e5c11e6a7bd184f32ca6bca(flow_list_id, obj){
    $.when(modi_c832fa5170e311e68db8184f32ca6bca(flow_list_id)).done(function(){
        $('#div_modal_c832fa5170e311e68db8184f32ca6bca .btn.blue').attr('onclick', 'save_o53659213e5c11e6a7bd184f32ca6bca();');
        // 回写
        writeBack(allSelectedDict[flow_list_id], 'field_name');
        $('#r2d78b9e70e411e6921c184f32ca6bca').trigger('change');
        writeBack(allSelectedDict[flow_list_id], 'val_before');
        writeBack(allSelectedDict[flow_list_id], 'val_after');
    });
}
// 编辑时回写内容到对话框内
function writeBack(selectedDict, key){
    if(typeof selectedDict[key]=='object'){
        $('#' + key_uuid[key]).val(Object.keys(selectedDict[key])[0]);
        $('#s2id_' + key_uuid[key]).find('.select2-chosen').text(Object.values(selectedDict[key])[0]);
    }else{
        $('#' + key_uuid[key]).val(selectedDict[key]);
    }
}