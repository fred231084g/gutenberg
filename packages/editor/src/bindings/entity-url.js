/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreDataStore } from '@wordpress/core-data';

export default {
	name: 'core/entity-url',
	label: __( 'Entity URL' ),
	usesContext: [ 'postId', 'postType' ],
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
		if ( kind === 'post-type' || type === 'post' || type === 'page' ) {
			const post = getEntityRecord(
				'postType',
				type || 'post',
				linkedPostId
			);
			url = post?.link || '';
		}
		// Handle taxonomies
		else if ( kind === 'taxonomy' ) {
			const term = getEntityRecord( 'taxonomy', type, linkedPostId );
			url = term?.link || '';
		}

		return {
			url,
		};
	},
	canUserEditValue() {
		// Read-only since it's derived from post data
		return false;
	},
};
