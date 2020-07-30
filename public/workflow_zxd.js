//var flowid,dict;
$(function(){
    //flowid = parseUrlParams().flowid;
	setTimeout(function(){ 
		console.log($('#formContainer_c1c6f1266eb68a4f90c51cb63d94f92defadc0ed').length);
		console.log($(".form-horizontal").children('hr').length);
		const flag1=$('#formContainer_c1c6f1266eb68a4f90c51cb63d94f92defadc0ed').length;
		const flag2=$(".form-horizontal").children('hr').length;
		const html = `
			<div class="row-fluid">
			<div class="span12">
				<div id="div_c8659880539611e68c9bb888e335e00a" class="control-group">
					<label class="control-label"><span class="required">*</span>信托登记要素</label>
					<div class="controls" id="divVal_c8659880539611e68c9bb888e335e00a">
						<button type="button" id="buttonzxd1" disabled="disabled" onclick="chYdj('/node/preProductInfo.html','预登记')">预登记</button> 
						<button type="button" id="buttonzxd2" disabled="disabled" onclick="chYdj('/node/initProductInfo.html','初始变更更正登记')">初始变更更正登记</button>
						<button type="button" id="buttonzxd3" disabled="disabled" onclick="chYdj('/node/finishProductInfo.html','终止登记')">终止登记</button>
						<button type="button" id="buttonzxd4" disabled="disabled" onclick="chYdj('/node/reportProductInfo.html','事前报告登记')">事前报告登记</button>
						<div id="mdldiv_frame" class="modal container hide fade" tabindex="-1" role="dialog" aria-labelledby="myModal_frameContainer" aria-hidden="true">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h3 id="modal_frameContainer_title"></h3>
							</div>
							<div class="modal-body">
								<iframe src="" id="modalFrameContainer" name="modalFrameContainer" seamless="" frameborder="0" height="700" width="100%"></iframe>
							</div>
						</div>
						<script type="text/javascript">
						function chYdj(url,title) {
							let query = location.href.substr(location.href.indexOf('?') + 1)
							jQuery('#modal_frameContainer_title').html(title);
							jQuery('#modalFrameContainer').attr('src',url + '?' + query);
							jQuery('#mdldiv_frame').modal('show');
						}
						//根据登记类型控制按钮是否可用
						if($(document).attr("title").indexOf("预登记")>=0){
							document.getElementById('buttonzxd1').disabled=false;
						}else if($(document).attr("title").indexOf("重新申请预登记")>=0){
							document.getElementById('buttonzxd1').disabled=false;
						}else if($(document).attr("title").indexOf("补充预登记")>=0){
							document.getElementById('buttonzxd1').disabled=false;
						}else if($(document).attr("title").indexOf("初始登记")>=0){
							document.getElementById('buttonzxd2').disabled=false;						
						}else if($(document).attr("title").indexOf("变更登记") >=0){
							document.getElementById('buttonzxd2').disabled=false;						
						}else if($(document).attr("title").indexOf("更正登记") >=0){
							document.getElementById('buttonzxd2').disabled=false;
						}else if($(document).attr("title").indexOf("终止登记") >=0){
							document.getElementById('buttonzxd3').disabled=false;						
						}else if($(document).attr("title").indexOf("初始登记（补办）") >=0){
							document.getElementById('buttonzxd2').disabled=false;
						}else if($(document).attr("title").indexOf("事前报告") >=0){
							document.getElementById('buttonzxd4').disabled=false;
						}else {
							document.getElementById('buttonzxd1').disabled=false;
							document.getElementById('buttonzxd2').disabled=false;
							document.getElementById('buttonzxd3').disabled=false;
							document.getElementById('buttonzxd4').disabled=false;
						}						
						</script>
					</div>
				</div>
			</div>
		</div>
			`
		if(flag1>0) $('#formContainer_c1c6f1266eb68a4f90c51cb63d94f92defadc0ed').append(html)
		if(flag1==0 && flag2>0) $(".form-horizontal").children('hr').append(html)
	}, 1000);
});
