/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreDataStore } from '@wordpress/core-data';

export default {
	name: 'core/entity-url',
	label: __( 'Entity URL' ),
	usesContext: [ 'postId', 'postType' ],
	getValues( { select, context } ) {
		if ( ! context?.postId || ! context?.postType ) {
			return {};
		}

		const { getEditedEntityRecord } = select( coreDataStore );
		const entity = getEditedEntityRecord(
			'postType',
			context.postType,
			context.postId
		);

		if ( ! entity ) {
			return {};
		}

		return {
			url: entity.link || '',
		};
	},
	canUserEditValue() {
		// For MVP, allow editing - in production this should check permissions
		return true;
	},
};
