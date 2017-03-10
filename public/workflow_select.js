var allSelectedDict = {};
// 替换下拉选id为name的流程
var select_flownames = [
    '项目签报变更流程','抵质押物录入流程'
];
$(function(){
    // 项目签报变更流程
    // 可能执行的时候dom还没渲染完成,这里加个轮询
    var loop = setInterval(function(){
        // $('#c832fa5170e311e68db8184f32ca6bca')
        if($('#divVal_c832fa5170e311e68db8184f32ca6bca input:eq(0)').val()!=undefined){
            allSelectedDict = JSON.parse($('#divVal_c832fa5170e311e68db8184f32ca6bca input:eq(0)').val());
            if(Object.values(allSelectedDict[0]).length<5){
                return;
            }
            // 更改现有table里的错误内容
            coverWrongText();
            // 替换蓝色加号按钮的点击事件
            $('.btn.blue.mini').attr('href','javascript:listAdd_o53659213e5c11e6a7bd184f32ca6bca();');
            clearInterval(loop);
        }
    },1000);
});
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
        // 更改现有table里的错误内容
        coverWrongText();
    });
}
function coverWrongText(){
    var selectedDict,chgdetail_id;
    $('.table.table-condensed.dataTable tbody tr').each(function(index){
        chgdetail_id = allSelectedDict[index]['CHGDETAIL_ID'];
        selectedDict = allSelectedDict[index][chgdetail_id];
        // 代理查看方法,用于往对话框里回写数据
        if($(this).find('.btn.btn-purple.btn-xs.mini.purple').size()==0){
            changeJSFunc($(this).find('td:eq(0) a'), 'listView_o53659213e5c11e6a7bd184f32ca6bca');
        } else {
            // 代理编辑按钮
            changeJSFunc($(this).find('.btn.btn-purple.btn-xs.mini.purple'), 'listEdit_o53659213e5c11e6a7bd184f32ca6bca');
        }
        doCoverWrongText($(this).find('td:eq(1)'), selectedDict['field_name']);
        doCoverWrongText($(this).find('td:eq(2)'), selectedDict['val_before']);
        doCoverWrongText($(this).find('td:eq(3)'), selectedDict['val_after']);
        // 框架里认为json_data里的key都有对应dom,代理往里面存放了点别的内容,防止框架里的代码报错,这里添加一个无用的dom
        $('body').append('<input type="hidden" id="'+ chgdetail_id +'"/>');
    });
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
function listView_o53659213e5c11e6a7bd184f32ca6bca(flow_list_id, obj){
    var fn = eval('view_' + $('#divVal_c832fa5170e311e68db8184f32ca6bca input:eq(0)').attr('id'));
    fn.call(flow_list_id);
    allSelectedDict.forEach(function(data, index){
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