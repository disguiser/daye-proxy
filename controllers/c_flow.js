'use strict';
const temple = require('../utils/temple.js');
const d_flow = require('../dao/d_flow.js');
const d_attachment = require('../dao/d_attachment.js');
const dict_file_type = require('../dicts/dict_file_type');
const dict_yes_or_no = require('../dicts/dict_yes_or_no');
const d_dict = require('../dao/d_dict.js');
const tools = require('../utils/tools.js');
const moment = require('moment');
const fs = require('mz/fs');
// const accounting = require('accounting-js');
// const nzhcn = require('nzh').cn;

// 字典,用于映射
let flow_regitem = {
    // 合同审批流程
    afad680f3ec711e6ae92184f32ca6bca: {
        XTWJMC: 'x7857b1e3ebc11e68228184f32ca6bca' // 信托文件
    },
    // 合同审批流程(非实质性变更)
    d70e099e240411e7a3af005056a687a8: {
        XTWJMC: 'w7824b2650e711e79fa3000c294af360' // 信托文件
    },
    rdf83711470311e68bb0184f32ca6bca: {
        regitem_id: 'wb14720059e311e6adbef0def1c335c3'
    },
    o53659213e5c11e6a7bd184f32ca6bca: {
        regitem_id: 'd7fbd530789311e6a510184f32ca6bca',
        json_data: 'c832fa5170e311e68db8184f32ca6bca'
    },
    eebf606e3e6411e68f15184f32ca6bca: {
        regitem_id: 'v78cb1a16f4311e6a83340f02f0658fc'
    },
    p0cf06613e8e11e680a2184f32ca6bca: {
        regitem_id: 'o6587480546111e6ac90b888e335e00a'
    },
    x0e79ca1470711e69bce184f32ca6bca: {
        regitem_id: 'ba2f776159e311e6b245f0def1c335c3'
    },
    wfee86703bb611e7ae5d000c294af360: {
        regitem_id: 't2481c3059e111e68f3bf0def1c335c3'
    },
    od1bb94f470811e6ac64184f32ca6bca: {
        regitem_id: 'd85e0f3059e311e6993bf0def1c335c3'
    },
    v4b02a4f3e8a11e6ac80184f32ca6bca: { // 资产解押审批流程
        regitem_id: 'xcd1b98f59e211e6b633f0def1c335c3',
        JXZC: 'eb4692f03e9c11e6b807184f32ca6bca', // 解押/解约财产
        XYYSCLQD: 'fa9185803e9c11e68dd0184f32ca6bca' // 需要用印材料清单
    },
    s8555e40476611e7a73d000c294af360: {
        regitem_id: 'f135b2f84c3711e7ba6b000c294af360'
    },
    ta32efd13e8c11e6ae36184f32ca6bca: { // 受益权转让审批流程
        regitem_id: 'w2b93c1e092f11e78e55005056a60fd8'
    },
    v93e92803bb611e787b3000c294af360: { // 消费贷款放款
        regitem_id: 't2481c3059e111e68f3bf0def1c335c3'
    },
    pfb34fc0471111e6a77b184f32ca6bca: { // 信托资金/销售资金监管使用申请流程
        regitem_id: 'fb5fcf5e59e211e683acf0def1c335c3'
    },
    b5792af0470e11e68438184f32ca6bca: { // 用印审批流程
        APPROVALSELA: 'w240a48f41b511e79398000c294af360',
        regitem_id: 'sa87f08f59e311e6b81ff0def1c335c3'
    },
    xca765cf519611e79e8d005056a687a8: { // 抵质押权利证书(证明)领用审批
        regitem_id: 'q9bd48de516f11e79ac9005056a687a8'
    },
    c722681e519411e78b64005056a687a8: { // 信托合同交接记录(集合)
        regitem_id: 'f3461aee519e11e78d3b005056a687a8'
    },
    f92d6e211fe711e7bca7005056a687a8: { // 清算报告审批单
        regitem_id: 'qa29b430b77d11e6b6e460d819cae7ab'
    },
    t4cd0f403e8b11e6ad89184f32ca6bca: { // 清算报告审批单
        regitem_id: 't879ff4f59e211e69feff0def1c335c3'
    }
    //d30aa0dea29711e79897000c294af360: { // 房屋抵押贷款用印申请流程
        //regitem_id: 'c740c958a29811e79ab5000c294af360'
    //}
}
let attaRebuild = async (ctx, json_attachments) => {
    let flow_list_ids = [];
    json_attachments.forEach(e => {
        //console.log(e.LIST_UUID);
        flow_list_ids.push(e.LIST_UUID);
    });
    console.log("++++++++++++++++flow_list_ids++++++++++++++++++++++");
    console.log(flow_list_ids);
    if (flow_list_ids.length == 0) {
        return;
    }
    let attachments = await d_attachment.find_by_flis(flow_list_ids);
    if (attachments.length == 0) {
        return;
    }
    // 去除冗余
    let _attachments = await d_attachment.find_by_ti(attachments[0].temp_id);
    ctx.logger.debug(JSON.stringify(attachments));
    ctx.logger.debug(JSON.stringify(_attachments));
    if (_attachments.length > attachments.length) {
        let ids = [],
            file_paths;
        _attachments.forEach((e, i) => {
            if (flow_list_ids.indexOf(e.flow_list_id) < 0) {
                ids.push(e.ID);
                fs.unlink(e.file_path);
            }
        });
        await d_attachment.delete_by_ids(ctx, ids);
    }
    // console.log(attachments);
    // 根据flow_list_id分组
    let attach_rebuild = {};
    attach_rebuild['temp_id'] = attachments[0] === undefined ? '' : attachments[0].temp_id
    attachments.forEach(element => {
        if( attach_rebuild[element.flow_list_id] == undefined){
            attach_rebuild[element.flow_list_id] = new Array();
            attach_rebuild[element.flow_list_id].push(element);
        }else{
            attach_rebuild[element.flow_list_id].push(element);
        }
    });
    ctx.logger.debug("attach_rebuild", JSON.stringify(attach_rebuild));
    console.log("++++++++++++++++attach_rebuild++++++++++++++++++++++");
    console.log(attach_rebuild);
    return attach_rebuild;
}
let contractApproval = async (ctx, affair) => {
    // 合同审批流程
    let res;
    let json_data = affair.jsondata;
    if(json_data!=''){
        json_data = JSON.parse(json_data);
        // 信托文件
        let intrust_attachments = JSON.parse(json_data[flow_regitem[affair.flow_id]['XTWJMC']]);
        
        let attach_rebuild = await attaRebuild(ctx, intrust_attachments);

        res = {
            success: temple.render('atta_table.html' ,{
                intrust_attachments: intrust_attachments,
                attachments: attach_rebuild,
                dict_file_type: dict_file_type
            })
        };
    } else {
        res = {fail: '未找到对应jsondata'};
    }
    return res;
}
// 产品发行流程
let productDistribution  = async(affair) => {
    // 产品ID
    let regitem_id = JSON.parse(affair.jsondata)['dbc8550ff27a11e6b67a1c3e84e5807c'];
    let project_info = await d_flow.find_project_info(regitem_id);
    let json_data = await d_flow.find_tasks(affair.affa_id, "'T16D12D1A5D3406D9CC65A76AD7691B1','PBB558EE7E914339B01828AC11437874','D6887042FAD54274857C6A48018A820F'");
    return {
        success: temple.render('fx_table.html', {
            project_info: project_info,
            json_data: json_data,
            dict_yes_or_no: dict_yes_or_no
        })
    };
}
// 项目签报变更流程
let sign = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('zs_chang_apply.html', {
            project_info: project_info,
            json_data: parsedJson
        })
    }
}
// 中后期重大事项签报流程
let importantMatter = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('important_matter.html', {
            project_info: project_info,
            json_data: parsedJson
        })
    }
}
// 项目签报审批流程
let projectReport = async(affair) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    return {
        success: temple.render('project_sign.html', {
            project_info: project_info
        })
    };
}
// 项目审批流程
let projectApproval = async(affair) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    return {
        success: temple.render('project_declare.html', {
            project_info: project_info,
            today: moment().format('YYYY年MM月DD日'),
            affa_id: affair.affa_id
        })
    };
}
// 收款流程 + 付款流程
let receivables = async(affair) => {
    // console.log(affair.jsondata);
    let json_data = JSON.parse(affair.jsondata);
    let node_id = affair.node_id ? affair.node_id : '';
    if (affair.flow_id=='v7608f2e3e8811e688c2184f32ca6bca') { // 收款
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printInNotice?in_uuid=${json_data.u948ea80f5b911e68893415645000030}&node_id=${node_id}"></iframe>`
        }
    } else if (affair.flow_id=='v11a7d403e8611e6b07e184f32ca6bca'){ // 付款
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printPayNotice?pay_uuid=${json_data.c7d2586153c611e6858ab888e335e00a}&affaid=${affair.affa_id}&node_id=${node_id}"></iframe>`
        }
    } else if(affair.flow_id=='fdf2ed804a6411e6905fd85de21f6642'){ // 放款审批流程
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printOutNotice?loan_uuid=${json_data.q6d38600020811e7b242415645000030}&affaid=${affair.affa_id}&node_id=${node_id}"></iframe>`
        }
    } else if (affair.flow_id == 'rfb70130910911e6a83c184f32ca6bca') { // 收支计划审批流程
        return {
            success: `<a id="theA" target="_black" href="/x/intrustqlc/views/dy/inPayPlan?affa_id=${affair.affa_id}" >查看收支计划</a>`
        }
    } else if (affair.flow_id == 'wb2eee409a6211e687f3415645000030') { // 工作计划审批流程
        return {
            success: `<a id="theA" target="_black" href="/x/intrustqlc/views/dy/taskPlan?affa_id=${affair.affa_id}" >查看工作计划</a>`
        }
    }
}
let accountOpen = async(affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    affair_json['q48407a1520711e6b198b888e335e00a'] = tools.splitBankNo(affair_json['q48407a1520711e6b198b888e335e00a']) // 格式化
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let product_info = await d_flow.find_product_info(regitem_id);
    // let task_jsons = await d_flow.find_tasks(affair, "'O91D097B848A4CFD934EB2A1848D5D04','UEBA868CD26E4027A05B3D6CB91B4201'");
    let bank_name = await d_flow.find_bank_name(affair_json['aaf42ff0520611e688c2b888e335e00a']);
    return {
        success: temple.render('account_open.html', {
            project_info: project_info,
            product_info: product_info,
            affair_json: affair_json,
            dict_yes_or_no: dict_yes_or_no,
            bank_name: bank_name
        })
    };
}
let accountCancel = async(affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let account_id = affair_json['s64420403ea311e6aebb184f32ca6bca'];
    let project_info = await d_flow.find_project_info(regitem_id);
    let product_info = await d_flow.find_product_info(regitem_id);
    let account_info = await d_flow.find_account_info(account_id);
    affair_json['w83e270fcccf11e6a211005056a687a8'] = tools.splitBankNo(affair_json['w83e270fcccf11e6a211005056a687a8']) //格式化
    account_info['ACCT_BANK_ACCT'] = tools.splitBankNo(account_info['ACCT_BANK_ACCT'])             // 银行账号格式化
    return {
        success: temple.render('account_cancel.html', {
            project_info: project_info,
            product_info: product_info,
            account_info: account_info,
            today:moment().format('YYYY-MM-DD'),
            affair_json: affair_json
        })
    };
}
// 放款审批流程(消费贷及房抵贷)
let payApply = async (affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let pa_info = await d_flow.find_pay_apply(affair.affa_id);
    let link = affair.flow_id == 'wfee86703bb611e7ae5d000c294af360' ? true : false; 
    return {
        success: temple.render('pay_apply.html', {
            project_info: project_info,
            pa_info: pa_info,
            link: link,
            affair_json:affair_json
        })
    }
}
// 外派人员（含董监事）委派审批流程
let expatriateApply = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('expatriate_apply.html', {
            project_info: project_info,
            json_data: parsedJson,
            json_arr: JSON.parse(parsedJson.e78b34f0472911e684f0184f32ca6bca)
        })
    }
}
// 外派人员行使表决权审批流程
let xsbjq = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xsbjq.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 资产解押审批流程
let zcjyzysp = async (ctx, affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);

    let XYYSCLQD = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['XYYSCLQD']]);
    /**
     * flow_list_id == LIST_UUID
     * [{\"FS\":\"3\",\"WJMC\":\"\\u6388\\u6743\\u59d4\\u6258\\u4e66\",\"LIST_UUID\":\"C796EE44F2300001F2937C101BF0B9D0\"}]
     * [C796EE44F2300001F2937C101BF0B9D0:{file_name:'xxx',...}]
     */
    console.log(XYYSCLQD);
    let XYYSCLQD_atta;
    try {
        //XYYSCLQD = JSON.parse(XYYSCLQD); 
        XYYSCLQD_atta = await attaRebuild(ctx, XYYSCLQD);
    } catch (error) {
        ctx.logger.debug('老数据', XYYSCLQD);
    }
    let JXZC = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['JXZC']]);
    ctx.logger.debug('JXZC', JXZC);
    console.log(JXZC);
    let JXZC_atta = await attaRebuild(ctx, JXZC);
    console.log("===========XYYSCLQD_atta================");
    console.log(XYYSCLQD_atta);
    console.log("===========XYYSCLQD================");
    console.log(XYYSCLQD);
    console.log(typeof XYYSCLQD);
    return {
        success: temple.render('zcjyzysp.html', {
            json_data: parsedJson,
            project_info: project_info,
            // datas: datas,
            JXZC: JXZC,
            JXZC_atta: JXZC_atta,
            XYYSCLQD: XYYSCLQD,
            XYYSCLQD_atta: XYYSCLQD_atta,
            type: typeof XYYSCLQD
        })
    }
}
let syqzrdjqrd = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let pa_info = await d_flow.find_supply_info(affair.affa_id);
    parsedJson.sfbe518f3e9911e6ad2d184f32ca6bca = await d_flow.find_cust_name(parsedJson.sfbe518f3e9911e6ad2d184f32ca6bca);
    parsedJson.ufaa29c03e9911e6aa71184f32ca6bca = await d_flow.find_bank_name_ta(parsedJson.ufaa29c03e9911e6aa71184f32ca6bca);
    let cb = await d_flow.find_cb(parsedJson.f5d7cacf3e9811e6995f184f32ca6bca);
    return {
        success: temple.render('syqzrdjqrd.html', {
            json_data: parsedJson,
            project_info: project_info,
            pa_info:pa_info,
            cb: cb['cb']
        })
    }
}
// 信托资金/销售资金监管使用申请流程
let xtzjxszjjgsysq = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xtzjxszjjgsysq.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 信托业务章/印签使用审批流程
let xtywz = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xtywz.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }

}
// 用印审批流程
let yysplc = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let json_arr = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['APPROVALSELA']]);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let apprpvalsela = await d_flow.find_apprpvalsela(affair.affa_id,regitem_id);
    return {
        success: temple.render('yysplc.html', {
            json_data: parsedJson,
            project_info: project_info,
            apprpvalsela: apprpvalsela
        })
    }
}
// 抵质押权利证书(证明)领用审批
let dzyqlzs = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('dzyqlzs.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 信托合同交接记录(集合)
let xthtjjjl = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xthtjjjl.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 清算报告审批流程
let qsbgbd = async (affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('qsbgbd.html', {
            affair_json: affair_json,
            project_info: project_info
        })
    }

}

// 信息披露审批流程
let xxpllcspb = async (affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xxpllcspb.html', {
            affair_json: affair_json,
            project_info: project_info,
            create_user:affair.create_user,
            create_dept:affair.create_dept
        })
    }

}
// 信托受益权转让(集合)
let syqzrjh = async (affair) => {
    // 客户端渲染方式
    let data = await fs.readFile('templates/syqzrjh.html', 'utf-8');
    return {
        success: data
    }
}
let flowRouter = async(ctx, affair) => {
    let res;
    // console.log(affair);
    switch (affair.flow_id) {
        // 合同审批流程 + 合同审批流程(非实质性变更)
        case 'afad680f3ec711e6ae92184f32ca6bca':
        case 'd70e099e240411e7a3af005056a687a8':
            res = await contractApproval(ctx, affair);
            break;
        // 产品发行流程
        case 'b395b7615f9811e6b480b888e3e688de':
            res = await productDistribution(affair);
            break;
        // 项目签报审批流程
        case 'qba4418052fc11e68f55184f32ca6bca':
            res = await projectReport(affair);
            break;
        // 项目审批流程
        case 'de19f3e165a911e68d9140f02f0658fc':
            res = await projectApproval(affair);
            break;
        // 收款流程 + 付款流程 + 放款审批流程 + 收支计划审批流程 + 工作计划审批流程
        case 'v7608f2e3e8811e688c2184f32ca6bca':
        case 'v11a7d403e8611e6b07e184f32ca6bca':
        case 'fdf2ed804a6411e6905fd85de21f6642':
        case 'rfb70130910911e6a83c184f32ca6bca':
        case 'wb2eee409a6211e687f3415645000030':
            res = await receivables(affair);
            break;
        // 项目签报变更流程
        case 'o53659213e5c11e6a7bd184f32ca6bca':
            res = await sign(affair);
            break;
        // 中后期重大事项签报流程
        case 'rdf83711470311e68bb0184f32ca6bca':
            res = await importantMatter(affair);
            break;
        // 账户开户流程
        case 'eebf606e3e6411e68f15184f32ca6bca':
            res = await accountOpen(affair);
            break;
        // 销户流程
        case 'p0cf06613e8e11e680a2184f32ca6bca':
            res = await accountCancel(affair);
            break;
        // 放款审批流程(证券投资) + 放款审批流程(消费贷及房抵贷)
        case 'v93e92803bb611e787b3000c294af360':
        case 'wfee86703bb611e7ae5d000c294af360':
            res = await payApply(affair);
            break;
        // 外派人员行使表决权审批流程
        case 'od1bb94f470811e6ac64184f32ca6bca':
            res = await xsbjq(affair);
            break;
        // 外派人员（含董监事）委派审批流程
        case 'x0e79ca1470711e69bce184f32ca6bca':
            res = await expatriateApply(affair);
            break;
        // 资产解押审批流程
        case 'v4b02a4f3e8a11e6ac80184f32ca6bca':
            res = await zcjyzysp(ctx, affair);
            break;
        // 受益权转让审批流程
        case 'ta32efd13e8c11e6ae36184f32ca6bca':
            res = await syqzrdjqrd(affair);
            break;
        // 信托资金/销售资金监管使用申请流程
        case 'pfb34fc0471111e6a77b184f32ca6bca':
            res = await xtzjxszjjgsysq(affair);
            break;
        // 信托业务章/印签使用审批流程
        case 's8555e40476611e7a73d000c294af360':
            res = await xtywz(affair);
            break;
        // 用印审批流程
        case 'b5792af0470e11e68438184f32ca6bca':
            res = await yysplc(affair);
            break;
        // 抵质押权利证书(证明)领用审批
        case 'xca765cf519611e79e8d005056a687a8':
            res = await dzyqlzs(affair);
            break;
        // 信托合同交接记录(集合)
        case 'c722681e519411e78b64005056a687a8':
            res = await xthtjjjl(affair);
            break;
        // 信托受益权转让(集合)
        case 'sae22ba150d211e79ce6005056a687a8':
            res = await syqzrjh(affair);
            break;
        // 清算报告审批流程
        case 'f92d6e211fe711e7bca7005056a687a8':
            res = await qsbgbd(affair);
            break;
        // 信息披露审批流程
        case 't4cd0f403e8b11e6ad89184f32ca6bca':
            res = await xxpllcspb(affair);
            break;
        // 房屋抵押贷款用印申请流程
        //case 'd30aa0dea29711e79897000c294af360':
            //res = await fwdydkyysplc(affair);
            //break;
        default:
            res = {fail: '非指定流程'};
            break;
    }
    return res;
}
// 流程展示
module.exports = function (router) {
    router.get('/flow_show_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        let affair = await d_flow.find_affar_by_taskid(task_id);
        ctx.response.body = await flowRouter(ctx, affair);
    });
    router.get('/flow_show_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let affair = await d_flow.find_affar(affa_id);
        ctx.response.body = await flowRouter(ctx, affair);
    });
    // 通过字典id找字典名称 涉及流程: 贷款投资合同录入流程
    router.get('/getDictName/:dict_id', async (ctx, next) => {
        let dict_id = ctx.params.dict_id;
        ctx.response.body = await d_dict.find_guarantor_dict(dict_id, next);
    });
    // 担保合同编号
    router.get('/getContractId/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let contract_ids = await d_dict.get_contract_id(regitem_id, next);
        ctx.response.body = contract_ids.join(',');
    });
    // 获取流程实例信息
    router.get('/affa_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        ctx.response.body = await d_flow.find_affar_by_taskid(task_id);
    });
    router.get('/affa_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        ctx.response.body = await d_flow.find_affar(affa_id);
    });
    // 获取项目id
    router.get('/regitemid_taskid/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        ctx.response.body = await d_flow.find_regitem_id_by_taskid(task_id);
    });
    router.get('/regitemid_affaid/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        ctx.response.body = await d_flow.find_regitem_id_by_affaid(affa_id);
    });
}