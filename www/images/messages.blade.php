<div class="upload_success">
	<div class="upload_success_area">
		<div class="ds_upload_area_h"> <h3>Messages</h3> <p>Send and receive messages, stay in touch with creators & clients.</p></div>
		<br>
		<div class="row">
			<div class="col l2 m3 s12">
				<div class="filtering">
					<div class="input-field">
					    <select id="filtering_message">
					      <option value="" disabled selected>Sorting</option>
					      <option  value="all">All</option>
					      <option  value="read">Read</option>
					      <option  value="unread">Unread</option>
					      <option  value="starred">Starred</option>
					      <option value="non-starred">Unstarred</option>
					    </select>
					 </div>
				</div>
			</div>
			<div class="col l3 m4 s12">
				<div class="markek_action">
					<img class="tooltipped" data-value="unread" data-position="top" data-delay="50" data-tooltip="Mark as unread" src="[[cdn_url]]/images/m_uread.jpg" alt="Unread">
					<img class="tooltipped" data-value="read"  data-position="top" data-delay="50" data-tooltip="Mark as read" src="[[cdn_url]]/images/m_read.jpg" alt="Read">
					<img class="tooltipped" data-value="trash" data-position="top" data-delay="50" data-tooltip="Trash" src="[[cdn_url]]/images/m_trash.jpg" alt="Trash">
				</div>
			</div>
		</div>
<script>
$(document).ready(function() {
    $('select').material_select(); 
    $('.tooltipped').tooltip({delay: 50});
    $(".markek_action img").click(function(){
		var this_action=$(this).attr('data-value');
		$("#ds_action").val(this_action);
		$("form#single_message_action").submit();
	});


	$("td.message_list_star i").click(function(){
		var conversationid=$(this).attr('data-conversationid');
		$("#special_conversation").val(conversationid);

		var this_action=$(this).attr('data-star');
		$("#ds_action").val(this_action);
		$("form#single_message_action").submit();
	});

	$("#filtering_message").change(function(){
		var status_var=$(this).val();
		var new_location='/messages?status=' + status_var;
		console.log(new_location);
		window.location.replace(new_location);
	});
  });	
</script>
		<div class="row" ng-if="available==true">
			<div class="col l12 m12 s12">
{!! Form::open(array('url' => url('/message_action'), 'class'=>'single_message_action', 'id'=>'single_message_action')) !!}
<input type="hidden" name="action" value="" id="ds_action">
<input type="hidden" name="special_conversation" value="" id="special_conversation">
				<div class="ds_conversation_list">
					<table class="bordered responsive-table">
						<tr dir-paginate="message in conversations | itemsPerPage:15" >
							<td>
								<p>
									<input type="checkbox" name="conversation[]" value="[[message.conversation_id]]"
									 id="select_message[[message.conversation_id]]"> 
									<label for="select_message[[message.conversation_id]]"></label>
								</p>
							</td>
							<td class="message_list_star">
								<i data-star="non_star" data-conversationid="[[message.conversation_id]]" class=" fa fa-star-o fa-lg"></i>
							</td>
							<td>
								<a target="_blank" href="[[api_url]]">
									<img src="[[cdn_url]]/images/seller_d_pp.png" alt="Avatar">
								</a>
							</td>
							<td class="seller_name_re">
								<a target="_blank" href="[[api_url]]">UserName</a>
							</td>
							<td>
								<a href="#/messages/editorsdepot">
								[[message.last_conversation]]
								</a>
							</td>
							<td>[[message.updated_at]]</td>
						</tr>
					</table>
				</div>
{!! Form::close() !!}
				<div class="ds_pagiation" ng-show="available==true">
		          <dir-pagination-controls max-size="10" pagination-id="product.product_id" direction-links="true" boundary-links="true" > </dir-pagination-controls>
		        </div>
			</div>
		</div>
		<br>
		<br>
		<div ng-if="available==false" class="row">
			<div class="col l12 m12 s12">
				<div class="upload_success_area_main">
					<h3>You currently have no messages!</h3>
				</div>
			</div>
		</div>
	</div>
</div>
                </div>
            </div>
        </div>
    </div>
</div>