<?php
/*Theme start*/
	function child_style_enqueue() {
		wp_enqueue_style( "child_style", get_stylesheet_uri(), [], filemtime( get_stylesheet_directory() . '/style.css' ) );
		if(is_singular("service") && get_post_meta( get_the_ID(),  "have_related_post", true)){
			wp_enqueue_style( "service_slider_style", get_stylesheet_directory_uri() . '/service-slider-style.css', [], filemtime( get_stylesheet_directory() . '/service-slider-style.css' ) );
		}
	}

	add_action( "wp_enqueue_scripts", "child_style_enqueue" );



/*Theme start End*/


// Previous month and year

function previous_month_year_shortcode() {
    $current_month = date('n'); // Get current month as a number (1-12)
    $current_year = date('Y'); // Get current year
    
    $previous_month = $current_month - 1; // Calculate previous month
    
    // Handle December to January transition
    if ($previous_month < 1) {
        $previous_month = 12; // Set to December
        $current_year--; // Decrement the year
    }
    
    // Get the month name
    $month_name = date('F', mktime(0, 0, 0, $previous_month, 1)); // Return month name
    
    return $month_name . ' ' . $current_year . ' COHORTS'; // Return month, year, and "COHORTS"
}
add_shortcode('previous_month_year', 'previous_month_year_shortcode');



function post_video_fild(){
    $custom_field_value = get_post_meta(get_the_ID(), 'video_embed_code', true);
    if (!empty($custom_field_value)) {
        return $custom_field_value;
    }
}

add_shortcode( 'post_video_fild', 'post_video_fild' );



// Shortcode to display Author and updated date/time
function display_article_meta_no_link() {
    if (is_singular('articles')) { // Check if it's a single Article page
        $author = get_field('author'); // Get the Author relationship field
        $updated_date = get_the_modified_date('M j, Y \a\t h:i A'); // Get the last updated date/time
        
        // Start building the output
        $output = '<div class="article-meta">';
        $output .= 'Last updated by ';
        
        if ($author) {
            foreach ($author as $single_author) {
                $author_name = get_the_title($single_author);
                $output .= esc_html($author_name); // Add plain text for Author
            }
        } else {
            $output .= '';
        }
        
        $output .= ' on ' . esc_html($updated_date);
        $output .= '</div>';
        return $output;
    }
    return '';
}
add_shortcode('display_article_meta', 'display_article_meta_no_link');







// Shortcode to display Author, updated date/time, and reading time for 'interview-questions' post type
function display_interview_questions_meta() {
    if (is_singular('interview-questions')) { // Check if it's a single Interview Questions page
        $author = get_field('author'); // Get the Author relationship field
        $updated_date = get_the_modified_date('M j, Y \a\t h:i A'); // Get the last updated date/time
        
        // Start building the output
        $output = '<div class="interview-meta">';
        $output .= 'Last updated by ';
        
        if ($author) {
            foreach ($author as $single_author) {
                $author_name = get_the_title($single_author);
                $output .= esc_html($author_name); // Add plain text for Author
            }
        } else {
            $output .= '';
        }
        
        $output .= ' on ' . esc_html($updated_date);
        $output .= '</div>';
        return $output;
    }
    return '';
}
add_shortcode('display_interview_questions_meta', 'display_interview_questions_meta');



// Shortcode to display Author, updated date/time, and reading time for 'career-advice' post type
function display_career_advice_meta() {
    if (is_singular('career-advice')) { // Check if it's a single Career Advice page
        $author = get_field('author'); // Get the Author relationship field
        $updated_date = get_the_modified_date('M j, Y \a\t h:i A'); // Get the last updated date/time
        
        // Start building the output
        $output = '<div class="career-meta">';
        $output .= 'Last updated by ';
        
        if ($author) {
            foreach ($author as $single_author) {
                $author_name = get_the_title($single_author);
                $output .= esc_html($author_name); // Add plain text for Author
            }
        } else {
            $output .= '';
        }
        
        $output .= ' on ' . esc_html($updated_date);
        $output .= '</div>';
        return $output;
    }
    return '';
}
add_shortcode('display_career_advice_meta', 'display_career_advice_meta');



// Shortcode to display Author, updated date/time, and reading time for 'companies' post type
function display_companies_meta() {
    if (is_singular('companies')) { // Check if it's a single Companies page
        $author = get_field('author'); // Get the Author relationship field
        $updated_date = get_the_modified_date('M j, Y \a\t h:i A'); // Get the last updated date/time
        
        // Start building the output
        $output = '<div class="companies-meta">';
        $output .= 'Last updated by ';
        
        if ($author) {
            foreach ($author as $single_author) {
                $author_name = get_the_title($single_author);
                $output .= esc_html($author_name); // Add plain text for Author
            }
        } else {
            $output .= '';
        }
        
        $output .= ' on ' . esc_html($updated_date);
        $output .= '</div>';
        return $output;
    }
    return '';
}
add_shortcode('display_companies_meta', 'display_companies_meta');





// Shortcode to display Author, updated date/time, and reading time for "Learn" post type
function display_learn_meta_no_link() {
    if (is_singular('learn')) { // Check if it's a single Learn page
        $author = get_field('author'); // Get the Author relationship field
        $updated_date = get_the_modified_date('M j, Y \a\t h:i A'); // Get the last updated date/time
        
        // Start building the output
        $output = '<div class="learn-meta">';
        $output .= 'Last updated by ';
        
        if ($author) {
            foreach ($author as $single_author) {
                $author_name = get_the_title($single_author);
                $output .= esc_html($author_name); // Add plain text for Author
            }
        } else {
            $output .= '';
        }
        
        $output .= ' on ' . esc_html($updated_date);
        $output .= '</div>';
        return $output;
    }
    return '';
}
add_shortcode('display_learn_meta', 'display_learn_meta_no_link');



// Shortcode to display the last updated date for "Learn" post type
function display_learn_last_updated_date() {
    if (is_singular('learn')) { // Check if it's a single Learn page
        $updated_date = get_the_modified_date('F j, Y'); // Format: November 10, 2024
        
        // Build the output
        $output = '<div class="learn-last-updated">';
        $output .= 'Last updated on: ' . esc_html($updated_date);
        $output .= '</div>';
        
        return $output;
    }
    return '';
}
add_shortcode('display_learn_last_updated', 'display_learn_last_updated_date');













// Add webnear from to the footer
function webnear_from() {
    if ( !is_page( "3999" ) && !is_page( "12916" ) ) {
        echo do_shortcode('[elementor-template id="10247"]');
    }
	if ( strpos($_SERVER['REQUEST_URI'], '/blogs/') !== false ) {
    	echo do_shortcode('[elementor-template id="20452"]');
	}
}

add_action( 'wp_footer', 'webnear_from' );


// Filter Review Serial

add_action('elementor/query/review_query', function ($query) {
    $query->set('post_type', 'review');
    $query->set('meta_key', 'display_order');
    $query->set('orderby', 'meta_value_num'); // Order by numeric value of display_order
    $query->set('order', 'ASC'); // Ascending order
});

// Add Global Variable
function add_global_variable(){
    $webinar_type = get_post_meta(get_the_ID(), 'webinar_type', true);
    if(!$webinar_type) $webinar_type = "REGULAR";
    echo "
        <script>
            let webinarType = '{$webinar_type}';
        </script>
    ";
}

add_action( "wp_head", "add_global_variable" );

// slug 

function update_blog_rewrite_rules($args, $post_type) {
    $target_post_types = ['articles', 'interview-questions', 'problems', 'learn', 'companies', 'career-advice'];

    if (in_array($post_type, $target_post_types)) {
        $args['rewrite'] = [
            'slug' => 'blogs/' . $post_type,
            'with_front' => false
        ];
    }

    return $args;
}
add_filter('register_post_type_args', 'update_blog_rewrite_rules', 10, 2);



// Page title

function post_title_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'id' => get_the_ID(),
    ), $atts, 'post_title' );

    $post_title = get_the_title( $atts['id'] );
    return $post_title;
}
add_shortcode( 'post_title', 'post_title_shortcode' );



// Page Slug

function get_page_slug_shortcode() {
    global $post;

    if (is_object($post) && isset($post->post_name)) {
        return $post->post_name;
    }

    return '';
}
add_shortcode('page_slug', 'get_page_slug_shortcode');