//var flowid,dict;
$(function(){
    //flowid = parseUrlParams().flowid;
	setTimeout(function(){ 
		console.log($('#formContainer_c1c6f1266eb68a4f90c51cb63d94f92defadc0ed'));
		$('#formContainer_c1c6f1266eb68a4f90c51cb63d94f92defadc0ed').append(`
			<div class="row-fluid">
			<div class="span12">
				<div id="div_c8659880539611e68c9bb888e335e00a" class="control-group">
					<label class="control-label"><span class="required">*</span>信托登记要素</label>
					<div class="controls" id="divVal_c8659880539611e68c9bb888e335e00a">
						<button type="button" onclick="chYdj('/node/preProductInfo.html','预登记')">预登记</button> 
						<button type="button" onclick="chYdj('/node/initProductInfo.html','初始变更更正登记')">初始变更更正登记</button>
						<button type="button" onclick="chYdj('/node/finishProductInfo.html','终止登记')">终止登记</button>
						<button type="button" onclick="chYdj('/node/reportProductInfo.html','事前报告登记')">事前报告登记</button>
						<div id="mdldiv_frame" class="modal container hide fade" tabindex="-1" role="dialog" aria-labelledby="myModal_frameContainer" aria-hidden="true">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h3 id="modal_frameContainer_title"></h3>
							</div>
							<div class="modal-body">
								<iframe src="" id="modalFrameContainer" name="modalFrameContainer" seamless="" frameborder="0" height="700" width="100%"></iframe>
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
	}, 1000);
});
