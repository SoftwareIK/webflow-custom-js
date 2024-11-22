<?php

function get_show_course_ids(){
    $args = array(
        'post_type' => 'courses',
        'posts_per_page' => -1
    );
    $courses_query = new WP_Query($args);

    $post_ids = [];

    if ($courses_query->have_posts()) {
        while ($courses_query->have_posts()) {
            $courses_query->the_post();
            $post_id = get_the_ID();
            // Check if 'hide_on_courses_page' is set to false or "Off"
            if (!get_post_meta($post_id, 'hide_on_courses_page', true)) {
                $post_ids[] = $post_id;
            }
        }
        wp_reset_postdata();
    }
    return $post_ids;
}

$show_course_ids;

add_action("wp_head", function(){
    global $show_course_ids;
    $show_course_ids = get_show_course_ids();
});

add_action('elementor/query/show_courser_with_filter', function ($query) {
    global $show_course_ids;
    $query->set('post__in', $show_course_ids);
});



// Add webnear from to the footer
function webnear_from(){
	echo do_shortcode('[elementor-template id="1897"]');
}

add_action( 'wp_footer', 'webnear_from');