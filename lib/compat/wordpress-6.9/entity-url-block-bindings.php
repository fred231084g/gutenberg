<?php
/**
 * Entity URL source for the block bindings.
 *
 * @since 6.9.0
 * @package gutenberg
 * @subpackage Block Bindings
 */

/**
 * Gets value for Entity URL source.
 *
 * @since 6.9.0
 * @access private
 *
 * @param array    $source_args    Array containing source arguments used to look up the override value.
 *                                 Example: array( "id" => 123, "type" => "post", "kind" => "post-type" ).
 * @param WP_Block $block_instance The block instance.
 * @return mixed The value computed for the source.
 */
function gutenberg_block_bindings_entity_url_get_value( array $source_args, $block_instance ) {
	if ( empty( $source_args['id'] ) ) {
		return null;
	}

	$entity_id = $source_args['id'];
	$type      = $source_args['type'] ?? '';
	$kind      = $source_args['kind'] ?? '';

	// Handle post types
	if ( 'post-type' === $kind || 'post' === $type || 'page' === $type ) {
		$post = get_post( $entity_id );
		if ( ! $post ) {
			return null;
		}

		// Use the same post status validation as Navigation Link block
		$allowed_post_status = (array) apply_filters(
			'render_block_core_navigation_link_allowed_post_status',
			array( 'publish' ),
			array( 'id' => $entity_id, 'type' => $type, 'kind' => $kind ),
			$block_instance
		);
		if ( ! in_array( $post->post_status, $allowed_post_status, true ) ) {
			return null;
		}

		return esc_url( get_permalink( $entity_id ) );
	}

	// Handle taxonomies
	if ( 'taxonomy' === $kind ) {
		$term = get_term( $entity_id, $type );
		if ( is_wp_error( $term ) || ! $term ) {
			return null;
		}

		// Check if taxonomy is publicly queryable
		$taxonomy_object = get_taxonomy( $type );
		if ( ! $taxonomy_object || ! $taxonomy_object->publicly_queryable ) {
			if ( ! current_user_can( 'read' ) ) {
				return null;
			}
		}

		return esc_url( get_term_link( $term ) );
	}

	return null;
}

/**
 * Registers Entity URL source in the block bindings registry.
 *
 * @since 6.9.0
 * @access private
 */
function gutenberg_register_block_bindings_entity_url_source() {
	if ( get_block_bindings_source( 'core/entity-url' ) ) {
		// The source is already registered.
		return;
	}

	register_block_bindings_source(
		'core/entity-url',
		array(
			'label'              => _x( 'Entity URL', 'block bindings source' ),
			'get_value_callback' => 'gutenberg_block_bindings_entity_url_get_value',
		)
	);
}

add_action( 'init', 'gutenberg_register_block_bindings_entity_url_source' );
