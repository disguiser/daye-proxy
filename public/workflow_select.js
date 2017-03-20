// 项目签报变更流程 + 中后期签报变更流程
var allSelectedDict = [];
var key_uuid = {
    o53659213e5c11e6a7bd184f32ca6bca: {
        listid: 'c832fa5170e311e68db8184f32ca6bca'
    },
    rdf83711470311e68bb0184f32ca6bca: {
        listid: 's085a85e4f0911e69112184f32ca6bca'
    }
}
var flowid;
// 暂时两个流程用的都一样,不一样再归并到上面那个里面去
var key_paramuuid = {
    field_name: 'r2d78b9e70e411e6921c184f32ca6bca',
    val_before: 's0123bd170e411e6b54f184f32ca6bca',
    val_after: 'sc0fd81e70e411e68b2a184f32ca6bca'
}
$(function(){
    var urlParams = parseUrlParams();
    var affaid = urlParams.affaid,
        taskid = urlParams.taskid,
        url;
    if (urlParams.flowid != undefined) {
        flowid = urlParams.flowid;
    } else if (affaid != undefined) {
        url = '/node/flow_show_affa/'+affaid;
    } else if (taskid != undefined) {
        url = '/node/flow_show_task/'+taskid;
    } else {
        return;
    }
    if (url != undefined) {
        $.getJSON(url, function(data) {
            if (data.success != undefined) {
                flowid = data.success.flow_id;
                $('.detailinfo_ul li:nth-child(2) div:nth-child(2)').html(data.success.html);
                startDeal(flowid);
            }
        });
    } else {
        startDeal(flowid);
    }
});
function startDeal(flowid) {
    // 编辑页面一开始就得显示 可能执行的时候dom还没渲染完成,这里加个轮询
    var count = 0;
    var loop = setInterval(function(){
        // $('#c832fa5170e311e68db8184f32ca6bca')
        if ($('.btn.blue.mini').size() > 0) {
            // 替换蓝色加号按钮的点击事件
            // $('.btn.blue.mini').attr('href','javascript:listAdd();');
            // 替换保存按钮的点击事件 不会重新渲染,替换一次就够
            $('#div_modal_' + key_uuid[flowid]['listid'] + ' .btn.blue').attr('onclick', 'save();');
            var json_input = '#divVal_' + key_uuid[flowid]['listid'] + ' input:eq(0)';
            $(json_input).change(function(){
                inputValue = JSON.parse(this.value);
                // 删除
                if (allSelectedDict.length > inputValue.length) {
                    allSelectedDict = inputValue;
                    coverWrongText();
                }
            });
            if ($(json_input).val() != undefined && $(json_input).val() != '') {
                allSelectedDict = JSON.parse($(json_input).val());
                if (Object.values(allSelectedDict[0]).length < 5) {
                    clearInterval(loop);
                    return;
                }
                // 更改现有table里的错误内容
                coverWrongText();
                clearInterval(loop);
            } else {
                clearInterval(loop);
            }
        } else if ($('div[id="divVal_' + key_uuid[flowid]['listid'] + '"]').size() > 0) {
            allSelectedDict = {};
            $('div[id="divVal_' + key_uuid[flowid]['listid'] + '"]').each(function(index, element){
                var inputElement = $(element).find('input:eq(0)');
                allSelectedDict[inputElement.attr('id')] = JSON.parse(inputElement.val());
            });
            coverWrongText();
            clearInterval(loop);
        } else if (count>=5) {
            clearInterval(loop);
        }
        count ++ ;
    },1000);
}
// 全局变量 用于记录当前蓝色加号按钮是新增还是编辑 防止每次都渲染对话框 校验都会导致对话框重新渲染,只能接受对话框的重复渲染
// var new_or_edit = 'new';
// 代理新增函数 项目签报变更流程
// function listAdd(){
//     eval('modi_' + key_uuid[flowid]['listid'] + '("")');
// }
// 代理保存函数 项目签报变更流程
function save(){
    $('#' + key_paramuuid['val_after']).attr('required', '');
    if (!$('#form_' + key_uuid[flowid]['listid']).validate().form()) {
        return;
    }

    var selectedDict = {};
    // 修改要素
    selectedDict = saveDict(selectedDict, 'field_name');
    // 修改前
    selectedDict = saveDict(selectedDict, 'val_before');
    // 修改后 
    selectedDict = saveDict(selectedDict ,'val_after');

    if (selectedDict['val_after'] == selectedDict['val_before'] || 
        (selectedDict['val_after']['key'] != undefined && 
        selectedDict['val_after']['key'] == selectedDict['val_before']['key'])) {
        alert('修改前与修改后不能相同');
        return;
    }

    var chgdetail_id = $('#CHGDETAIL_ID').val();

    eval('mdl_save_' + key_uuid[flowid]['listid'] + '()');

    // 写到标签 用于提交时保存
    var json_data = JSON.parse($('#' + key_uuid[flowid]['listid']).val());
    json_data.forEach(function(data, index){
        if(data['CHGDETAIL_ID'] == chgdetail_id){
            data[chgdetail_id] = selectedDict;
        }
    });
    $('#' + key_uuid[flowid]['listid']).val(JSON.stringify(json_data));

    allSelectedDict = json_data;

    // 更改现有table里的错误内容
    coverWrongText();
}
// 覆盖变更明细内的文本
function coverWrongText(){
    var selectedDict,chgdetail_id,_allSelectedDict;
    if (allSelectedDict instanceof Array) {
        _allSelectedDict = allSelectedDict;
    } else {
        var tmp = Object.values(allSelectedDict);
        _allSelectedDict = tmp.reduce(function(x, y){
            return x.concat(y);
        });
    }
    $('.table.table-condensed.dataTable tbody tr').each(function(index){
        chgdetail_id = _allSelectedDict[index]['CHGDETAIL_ID'];
        selectedDict = _allSelectedDict[index][chgdetail_id];
        // 代理查看方法,用于往对话框里回写数据
        if($(this).find('.btn.btn-purple.btn-xs.mini.purple').size()==0){
            var flow_list_id = $(this).parent().parent().parent().find('input:eq(0)').attr('id');
            changeJSFunc($(this).find('td:eq(0) a'), 'listView', flow_list_id);
        } else {
            // 代理编辑按钮
            changeJSFunc($(this).find('.btn.btn-purple.btn-xs.mini.purple'), 'listEdit');
            // 代理删除按钮
            // changeJSFunc($(this).find('.btn.btn-grey.btn-xs.mini.black'), 'listDel_o53659213e5c11e6a7bd184f32ca6bca');
        }
        doCoverWrongText($(this).find('td:eq(1)'), selectedDict['field_name']);
        doCoverWrongText($(this).find('td:eq(2)'), selectedDict['val_before']);
        doCoverWrongText($(this).find('td:eq(3)'), selectedDict['val_after']);
        // 框架里认为json_data里的key都有对应dom,代理往里面存放了点别的内容,防止框架里的代码报错,这里添加一个无用的dom
        $('body').append('<input type="hidden" id="'+ chgdetail_id +'"/>');
    });
}
// 代理删除函数 项目签报流程
// 删除会重新渲染,需要重新替换
// function listDel_o53659213e5c11e6a7bd184f32ca6bca (flow_row_id, obj) {
//     $.when(del_c832fa5170e311e68db8184f32ca6bca(flow_row_id)).done(function(){
//         allSelectedDict.forEach(function(element, index){
//             if (element['CHGDETAIL_ID'] == flow_row_id) {
//                 allSelectedDict.splice(index, 1);
//             }
//         });
//         coverWrongText();
//     });
// }
// 代理编辑函数 项目签报变更流程
function listEdit(flow_row_id, obj){
    eval('modi_' + key_uuid[flowid]['listid'] + '(' + flow_row_id + ')');
    var fn = setInterval(function(){
        if ($('#' + key_paramuuid['field_name']).size()>0) {
            // 回写
            allSelectedDict.forEach(function(data, index){
                if(data['CHGDETAIL_ID']==flow_row_id){
                    writeBackInEdit(data, flow_row_id, 'field_name');
                    $('#' + key_paramuuid['field_name']).trigger('change');
                    writeBackInEdit(data, flow_row_id, 'val_before');
                    writeBackInEdit(data, flow_row_id, 'val_after');
                }
            });
            clearInterval(fn);
        }
    }, 500);
}
// 编辑时回写内容到对话框内
function writeBackInView(json, flow_row_id, key){
    if (typeof json[flow_row_id][key]=='object') {
        $('#' + key_paramuuid[key]).text(json[flow_row_id][key][json[key]]);
    } else {
        $('#' + key_paramuuid[key]).text(json[flow_row_id][key]);
    }
}
function writeBackInEdit(selectedDict, flow_row_id, key){
    if(typeof selectedDict[flow_row_id][key]=='object'){
        if (selectedDict[flow_row_id][key]['type'] == 'select') {
            $('#' + key_paramuuid[key]).val(selectedDict[key]);
            $('#s2id_' + key_paramuuid[key]).find('.select2-chosen').text(selectedDict[flow_row_id][key][selectedDict[key]]);
        } else {
            var checked = selectedDict[key].split('|');
            $('#divVal_' + key_paramuuid[key] + ' input').each(function(index, element){
                if (checked.indexOf($(element).val()) >= 0) {
                    $(element).trigger('click');
                }
            });
        }
    }else{
        $('#' + key_paramuuid[key]).val(selectedDict[flow_row_id][key]);
    }
}
// 将选中的下拉选内的key,value保存下来
function saveDict(selectedDict, key){
    if ($('#' + key_paramuuid[key]).is('select')) {
        var selectkey = $('#'+ key_paramuuid[key] +' option:selected').val();
        var value = $('#'+ key_paramuuid[key] +' option:selected').text();
        selectedDict[key] = {};
        selectedDict[key][selectkey] = value;
        selectedDict[key]['key'] = selectkey;
        selectedDict[key]['value'] = value;
        selectedDict[key]['type'] = 'select';
    } else if ($('#' + key_paramuuid[key]).is('input[type="checkbox"]')) {
        selectedDict[key] = {};
        var checkboxIds = [],
            checkboxNames = [],
            selectkey,
            value;
        $('#divVal_' + key_paramuuid[key] + ' label').each(function(index, element){
            if ($(element).find('input')[0].checked) {
                checkboxIds.push($(element).find('input').val());
                checkboxNames.push($(element).text());
            }
        });
        selectkey = checkboxIds.join('|');
        value = checkboxNames.join('|')
        selectedDict[key][selectkey] = value;
        selectedDict[key]['key'] = selectkey;
        selectedDict[key]['value'] = value;
        selectedDict[key]['type'] = 'checkbox';
    } else {
        selectedDict[key] = $('#' + key_paramuuid[key]).val();
    }
    return selectedDict;
}
function listView(flow_row_id, obj, flow_list_id){
    var fn = eval('view_' + flow_list_id + '("' + flow_row_id + '")');
    allSelectedDict[flow_list_id].forEach(function(data, index){
        if(data['CHGDETAIL_ID']==flow_row_id){
            writeBackInView(data, flow_row_id, 'field_name');
            writeBackInView(data, flow_row_id, 'val_before');
            writeBackInView(data, flow_row_id, 'val_after');
        }
    });
    // var loop = setInterval(function(){
    //     if($('#' + key_paramuuid['field_name']).text() != undefined && $('#' + key_paramuuid['field_name']).text() != ''){
    //         clearInterval(loop);
    //     }
    // }, 1000);
}