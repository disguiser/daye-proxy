$(function(){
    var urlParams = parseUrlParams();
    var flowid = urlParams.flowid;
    if (flowid == 'faca20a152f311e6892e184f32ca6bca') { // 贷款融资类合同录入流程
         修改编辑按钮的点击函数
        $('#d71c3200555111e69b1eb888e3e688de').change(function(){
            $('.btn.btn-purple.btn-xs.mini.purple').each(function(){
                changeJSFunc(this, 'listEdit_faca20a152f311e6892e184f32ca6bca');
            });
        });
    } else if (flowid == 'tc539970ff0911e694b4005056a60fd8' || flowid == 'v4b02a4f3e8a11e6ac80184f32ca6bca' || flowid == 'f059a1eedb1d11e7be6b005056a687a8') { // 抵质押物录入流程 + 资产解押审批流程+ 放款审批流程(消费贷及房抵贷)
        var regitem_id;
        if (flowid == 'tc539970ff0911e694b4005056a60fd8') {
            regitem_id = $('#t7d2de5eff2c11e6b53c1c3e84e5807c').val();
        } else if (flowid == 'v4b02a4f3e8a11e6ac80184f32ca6bca') {
            regitem_id = $('#xcd1b98f59e211e6b633f0def1c335c3').val();
        } else if (flowid == 'f059a1eedb1d11e7be6b005056a687a8') {
            regitem_id = $('#o051e2a1679311e8aa3e000c294af360').val();
        }
        excelImport('', flowid, regitem_id);// func.js
    } else if (flowid == 'v7608f2e3e8811e688c2184f32ca6bca') { // 收款流程
        $('#controlContainer').append('<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="1000px" src="/x/intrustqlc/views/dy/printInNotice?itemid=' + urlParams.itemid + '&itemName=' + urlParams.itemName + '&flowname=' + urlParams.flowname + '&uuid=' + urlParams.uuid + '"></iframe>');
    } else if (flowid == 'v11a7d403e8611e6b07e184f32ca6bca') { // 付款流程
        $('#controlContainer').append('<iframe id="noticeIframe1" scrolling="no" name="noticeIframe1" width="100%" frameborder="0" height="100%" src="/x/intrustqlc/views/dy/printPayNotice?itemid=' + urlParams.itemid + '&itemName=' + urlParams.itemName + '&flowname=' + urlParams.flowname + '&uuid=' + urlParams.uuid + '"></iframe>');
    } else if (flowid == 'p688af403e6e11e6a580184f32ca6bca') { // 资金信托合同登记流程
        $('#div_b1af1ec6942a11e69526ac2b6e56399c label:eq(0)').html('<a href="/f/v/objlist?clsid=fb1e00cf227e11e68731b8ee65291727&amp;pagid=r0e2aa00228311e68dccb8ee65291727" target="_blank">' + $('#div_b1af1ec6942a11e69526ac2b6e56399c label').html() + '</a>')
    } else if (flowid == 'ta32efd13e8c11e6ae36184f32ca6bca') { // 受益权转让审批流程
        $('#div_sfbe518f3e9911e6ad2d184f32ca6bca label:eq(0)').html('<a href="/f/v/objlist?clsid=fb1e00cf227e11e68731b8ee65291727&amp;pagid=r0e2aa00228311e68dccb8ee65291727" target="_blank">' + $('#div_sfbe518f3e9911e6ad2d184f32ca6bca label').html() + '</a>')
    } else if (flowid == 'p5b270cfdbdd11e691db1c3e84e5807c') { // 财产信托合同登记流程
        $('#div_pbce5bdedc9711e6a54d1c3e84e5807c label:eq(0)').html('<a href="/f/v/objlist?clsid=fb1e00cf227e11e68731b8ee65291727&amp;pagid=r0e2aa00228311e68dccb8ee65291727" target="_blank">' + $('#div_pbce5bdedc9711e6a54d1c3e84e5807c label').html() + '</a>')
    } else if (flowid === 'ab6e048f3e6211e68067184f32ca6bca') { // 信托登记审批流程
        $('#formContainer_c1c6f1266eb68a4f90c51cb63d94f92defadc0ed').append(`
        <div class="row-fluid">
        <div class="span12">
            <div id="div_c8659880539611e68c9bb888e335e00a" class="control-group">
                <label class="control-label"><span
                        class="required">*</span>信托登记要素</label>
                <div class="controls" id="divVal_c8659880539611e68c9bb888e335e00a">
                    <button type="button" onclick="chYdj('/node/printPayNotice.html','预登记')">预登记</button>
                    <button type="button" onclick="chYdj('/node/initProductInfo.html','初始登记')">初始登记</button>
                    <button type="button" onclick="chYdj('/node/finishProductInfo.html','终止登记')">终止登记</button>
                    <button type="button" onclick="chYdj('/node/reportProductInfo.html','事前报告登记')">事前报告登记</button>
                    <div id="mdldiv_frame" class="modal container hide fade" tabindex="-1" role="dialog" aria-labelledby="myModal_frameContainer" aria-hidden="true">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                            <h3 id="modal_frameContainer_title"></h3>
                        </div>
                        <div class="modal-body">
                            <iframe src="" id="modalFrameContainer" name="modalFrameContainer" seamless="" frameborder="0" height="468" width="100%"></iframe>
                        </div>
						<!--
                        <div class="modal-footer">
                            <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
                        </div>
						-->
                    </div>
                    <script type="text/javascript">
                    function chYdj(url,title) {
                        let query = location.href.substr(location.href.indexOf('?') + 1)
                        jQuery('#modal_frameContainer_title').html(title);
                        jQuery('#modalFrameContainer').attr('src',url + '?' + query);
                        jQuery('#mdldiv_frame').modal('show');
                    }
                    </script>
                </div>
            </div>
        </div>
    </div>
        `)
    }
});

//预登记


// 代理编辑函数 贷款投资合同录入流程
function listEdit_faca20a152f311e6892e184f32ca6bca(flow_list_id,obj){
    $.when(modi_d71c3200555111e69b1eb888e3e688de(flow_list_id)).done(function(){
        $('#spanshow_u4a6b2cf96a711e69b3968f728cd3fe1').text($(obj).parent().next().children().html());
        // 读取字典id,到后台查找字典名称
        // $.get('/node/getDictName/'+ $('#u4a6b2cf96a711e69b3968f728cd3fe1').val(), function(data){
        // });
    });
}
 