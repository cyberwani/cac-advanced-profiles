jQuery(document).ready( function($) {
	resize_drag_handles();

	// Set up sortable widgets
	$('body.profile-edit #cacap-widget-list').sortable({
		placeholder: 'ui-state-highlight',
		containment: 'parent',
		handle: '.cacap-drag-handle',
		stop: function( event, ui ) {
			$('#cacap-widget-order').val($(this).sortable( 'toArray' ));
		}
	});

	// Click to edit - delegated from parent
	window.cacapedittoggles = {};
	$('#cacap-widget-list').on('click', '.cacap-click-to-edit', function(e){
		var edit_div = this;

		var widget_id = $(edit_div).parent().attr('id');
		var is_widget_toggled = is_edit_toggled(widget_id);

		var edit_input = $(edit_div).find('.cacap-show-on-edit');
		var edit_title = $(edit_div).find('.cacap-hide-on-edit');

		var edit_input_field = $(edit_div).find('.cacap-edit-input');

		if ( ! is_widget_toggled ) {
			$(edit_input).show();
			$(edit_title).hide();
			$(edit_input_field).autogrow({animate:false});
			$(edit_input_field).trigger('keyup');

			var field_val = $(edit_input_field).val();

			// reset the val to get focus to the end. Dumb
			$(edit_input_field).focus().val('').val(field_val);

			// Set in global object in case of Cancel
			window.cacapedittoggles[widget_id] = field_val;
		} else {
			var restore_me = false;

			// Only do anything if clicking OK or Cancel
			if ( $(e.target).hasClass( 'cacap-ok' ) ) {
				var input_value = $(edit_input_field).val().replace(/\r?\n/g, '<br />');
				$(edit_title).html(input_value);
				restore_me = true;
			} else if ( $(e.target).hasClass( 'cacap-cancel' ) ) {
				$(edit_input_field).val(window.cacapedittoggles[widget_id]);
				restore_me = true;
			}

			if ( restore_me ) {
				delete window.cacapedittoggles[widget_id];
				$(edit_input).hide();
				$(edit_title).show();

				// Check to see whether the partner box is empty, and if so, open
				var my_buddy = $(this).siblings('.cacap-click-to-edit');
				var my_buddy_content = $(my_buddy).find('.cacap-edit-input').val();

				if ( '' == my_buddy_content ) {
					$(my_buddy).trigger('click');
				}
			}
		}

		resize_drag_handles();
		return false;
	});

	window.newwidget_count = 0;
	$('#cacap-new-widget-types li').on('click', function(e){
		if ($(this).hasClass('cacap-has-max')) {
			return false;
		}
		window.newwidget_count++;
		var widget_type = $(this).attr('id').slice(17);

		// Get the prototype and swap with the autoincrement
		var proto = $('#cacap-widget-prototype-'+widget_type).html();
		proto = proto.replace(/newwidgetkey/g, 'newwidget' + window.newwidget_count);

		var new_widget_id = "cacap-widget-newwidget" + window.newwidget_count;

		$('#cacap-widget-list').append('<li id="' + new_widget_id + '">' + proto + '</li>');
		var widget_order_input = $('#cacap-widget-order');
		var widget_order = widget_order_input.val().split(',');
		widget_order.push(new_widget_id);
		widget_order_input.val(widget_order);

		// Set focus on 'title', unless it's disabled
		var $new_widget = $('#' + new_widget_id);
		var $new_widget_title = $new_widget.find('.cacap-widget-title');
		if ( 'disabled' == $new_widget_title.find('.cacap-edit-input').attr('disabled') )	{
			$new_widget.find('.cacap-widget-content').trigger('click').focus();	
		} else {
			$new_widget_title.trigger('click').focus();
		}

		// Add the type class
		$new_widget.addClass( 'cacap-widget-' + widget_type );

		// Clone the Add New prototype for Positions
		if ( 'positions' == widget_type ) {
			clone_add_new_position_fields( $new_widget );
		}

		resize_drag_handles();

		return false;
	});

	$('#cacap-widget-list').on('click', '.cacap-widget-remove', function(e){
		var widget_order_input = $('#cacap-widget-order');
		var widget_order = widget_order_input.val().split(',');
		var widget_id = $(this).closest('#cacap-widget-list li').attr('id');
		var wo_key = $.inArray(widget_id, widget_order);

		widget_order.splice(wo_key, 1);
		widget_order_input.val(widget_order);

		$('#'+widget_id).remove();

		return false;
	});

	function is_edit_toggled(id) {
		return window.cacapedittoggles.hasOwnProperty(id);
	}

	function resize_drag_handles() {
		// Set height on draggable handles
		// Somebody shoot me
		$('body.profile-edit .cacap-drag-handle').each( function( k, v ) {
			$(v).css('height','0').css('height', $(v).parent().css('height'));	
		});
	}

	function clone_add_new_position_fields( $new_widget ) {
		$fields = $new_widget.find('#cacap-position-new').clone()
		
		// Don't need this class anymore
		$fields.removeClass('hide-if-js');

		// Swap 'new' with proper iterator
		// Subtract 1 for the prototype
		var existing_positions_count = $new_widget.find('ul').length - 1;
		var this_position_count = existing_positions_count + 1;
		var tpid = 'cacap-position-' + this_position_count;
		var thefor, thename, theid;

		$fields.removeAttr('id').attr('id', tpid);
		$fields.find('label').each( function(k, v) {
			thefor = $(this).attr('for');
			$(this).attr('for', thefor.replace('cacap-position-new', tpid));
		});
		$fields.find('input,select').each( function(k, v) {
			theid = $(this).attr('id');
			$(this).attr('id', theid.replace('cacap-position-new', tpid));
			thename = $(this).attr('name');
			$(this).attr('name', thename.replace('new', this_position_count));
		});
//		$fields.find('label').attr('for', this.replace('cacap-position-new', tpid));
		console.log( $fields );
		
		$fields.prependTo( $new_widget.find('.cacap-edit-content-input') );
	}
},(jQuery));
