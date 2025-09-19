/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreDataStore } from '@wordpress/core-data';

export default {
	name: 'core/entity-url',
	label: __( 'Entity URL' ),
	getValues( { select, clientId } ) {
		const { getBlockAttributes } = select( 'core/block-editor' );

		// Get the nav link's id attribute
		const blockAttributes = getBlockAttributes( clientId );
		const linkedPostId = blockAttributes?.id;

		if ( ! linkedPostId ) {
			return {};
		}

		const { getEntityRecord } = select( coreDataStore );

		// Get the post type and kind from block attributes
		const { type, kind } = blockAttributes || {};

		let url = '';

		// Handle post types
		if ( kind === 'post-type' ) {
			const post = getEntityRecord(
				'postType',
				type || 'post',
				linkedPostId
			);
			url = post?.link || '';
		}
		// Handle taxonomies
		else if ( kind === 'taxonomy' ) {
			// Convert 'tag' back to 'post_tag' for API calls
			// See update-attributes.js line 166 for the reverse conversion
			const taxonomySlug = type === 'tag' ? 'post_tag' : type;
			const term = getEntityRecord(
				'taxonomy',
				taxonomySlug,
				linkedPostId
			);
			url = term?.link || '';
		}

		return {
			url,
		};
	},
	canUserEditValue() {
		// This binding source provides read-only URLs derived from entity data
		// Users cannot manually edit these values as they are automatically
		// generated from the linked post/term's permalink
		return false;
	},
};
