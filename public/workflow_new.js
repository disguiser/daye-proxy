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
        $('#c832fa5170e311e68db8184f32ca6bca').change(function(){
        });
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
    selectedDict = saveDict(selectedDict, 'r2d78b9e70e411e6921c184f32ca6bca');
    // 修改前
    selectedDict = saveDict(selectedDict, 's0123bd170e411e6b54f184f32ca6bca');
    // 修改后 
    selectedDict = saveDict(selectedDict ,'sc0fd81e70e411e68b2a184f32ca6bca');

    allSelectedDict[$('#CHGDETAIL_ID').val()] = selectedDict;
    $.when(mdl_save_c832fa5170e311e68db8184f32ca6bca()).done(function(){
        new_or_edit = 'new';
        var key;
        $('#childObjTable_c832fa5170e311e68db8184f32ca6bca tbody tr').each(function(){
            if($(this).attr('processed')!=true){
                // 代理编辑按钮
                changeJSFunc($(this).find('.btn.btn-purple.btn-xs.mini.purple'), 'listEdit_o53659213e5c11e6a7bd184f32ca6bca');
                key = $(this).find('td:eq(1)').text();
                if(typeof selectedDict['r2d78b9e70e411e6921c184f32ca6bca']=='object'){
                    $(this).find('td:eq(1)').html(selectedDict['r2d78b9e70e411e6921c184f32ca6bca'][key]);
                }
                key = $(this).find('td:eq(2)').text();
                if(typeof selectedDict['s0123bd170e411e6b54f184f32ca6bca']=='object'){
                    $(this).find('td:eq(2)').html(selectedDict['s0123bd170e411e6b54f184f32ca6bca'][key]);
                }
                key = $(this).find('td:eq(3)').text();
                if(typeof selectedDict['sc0fd81e70e411e68b2a184f32ca6bca']=='object'){
                    $(this).find('td:eq(3)').html(selectedDict['sc0fd81e70e411e68b2a184f32ca6bca'][key]);
                }
                $(this).attr('processed', 'true');
            }
        });
    });
}
// 将选中的下拉选内的key,value保存下来
function saveDict(selectedDict,uuid){
    if($('#' + uuid).is('select')){
        var key = $('#'+ uuid +' option:selected').val();
        var value = $('#'+ uuid +' option:selected').text();
        selectedDict[uuid] = {};
        selectedDict[uuid][key] = value;
    } else {
        selectedDict[uuid] = $('#' + uuid).val();
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
        writeBack(allSelectedDict[flow_list_id], 'r2d78b9e70e411e6921c184f32ca6bca');
        $('#r2d78b9e70e411e6921c184f32ca6bca').trigger('change');
        writeBack(allSelectedDict[flow_list_id], 's0123bd170e411e6b54f184f32ca6bca');
        writeBack(allSelectedDict[flow_list_id], 'sc0fd81e70e411e68b2a184f32ca6bca');
    });
}
function writeBack(selectedDict, uuid){
    if(typeof selectedDict[uuid]=='object'){
        $('#' + uuid).val(Object.keys(selectedDict[uuid])[0]);
        $('#s2id_' + uuid).find('.select2-chosen').text(Object.values(selectedDict[uuid])[0]);
    }else{
        $('#' + uuid).val(selectedDict[uuid]);
    }
}