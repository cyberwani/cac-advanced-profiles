<?php
/**
 * The top-matter of the user header, displayed both in Edit and non-Edit mode
 */
?>

<div class="cacap-row cacap-hero-row<?php if ( cacap_is_commons_profile() ) : ?> stuck<?php endif ?>">
	<div class="cacap-sticky-dummy">
		<div class="cacap-hero">
			<h1>
				<a href="<?php echo bp_displayed_user_domain() ?>"><?php echo xprofile_get_field_data( 1, bp_displayed_user_id() ) ?></a>
			</h1>

			<?php if ( cacap_field_is_visible_for_user( 'Brief Descriptor' ) ) : ?>
				<h4 class="cacap-short-aboutme"><?php echo xprofile_get_field_data( 'Brief Descriptor', bp_displayed_user_id() ) ?></h4>
			<?php endif ?>

			<?php if ( cacap_field_is_visible_for_user( 'About You' ) ) : ?>
				<div class="cacap-long-aboutme">
					<?php echo wpautop( bp_create_excerpt( html_entity_decode( xprofile_get_field_data( 'About You', bp_displayed_user_id() ) ), 355 ) ) ?>
				</div>
			<?php endif ?>
		</div>

		<div class="cacap-avatar">
			<?php bp_displayed_user_avatar( array(
				'type' => 'full',
				'width' => '130px',
				'height' => '130px',
			) ) ?>
			<div class="activity"><?php bp_last_activity( bp_displayed_user_id() ) ?></div>

			<?php if ( bp_is_my_profile() ) : ?>
				<div id="change-avatar-button" class="generic-button">
					<a href="<?php echo bp_displayed_user_domain() ?>profile/change-avatar">Change Avatar</a>
				</div>
			<?php endif ?>

			<?php if ( bp_is_active( 'friends' ) ) : ?>
				<?php bp_add_friend_button( bp_displayed_user_id() ) ?>
			<?php endif ?>

			<?php if ( bp_is_active( 'messages' ) ) : ?>
				<?php bp_send_private_message_button( bp_displayed_user_id() ) ?>
			<?php endif ?>

			<?php if ( bp_is_active( 'activity' ) ) : ?>
				<?php bp_send_public_message_button( bp_displayed_user_id() ) ?>
			<?php endif ?>

			<?php do_action( 'cacap_avatar_actions' ) ?>
		</div>
	</div>

	<?php if ( bp_is_my_profile() ) : ?>
		<div class="cacap-edit-buttons">
		<?php if ( bp_is_user_profile_edit() ) : ?>
			<input type="submit" value="<?php _e( 'Save Changes', 'cacap' ) ?>" class="cacap-edit-submit" />
			<a href="<?php echo bp_displayed_user_domain() ?>" class="cacap-edit-cancel button"><?php _e( 'Cancel', 'cacap' ) ?></a>
		<?php else : ?>
			<a href="<?php echo bp_displayed_user_domain() ?>/profile/edit/" class="cacap-edit-button button"><?php _e( 'Edit', 'cacap' ) ?></a>
		<?php endif ?>
		</div>
	<?php endif ?>
</div>
<div style="clear:both"> </div>
