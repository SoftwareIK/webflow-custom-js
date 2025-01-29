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



function get_hide_ides(){
    $args = array(
        'post_type' => 'instructors',
        'posts_per_page' => -1
    );
    $instructors_query = new WP_Query($args);

    $post_ids = [];

    if ($instructors_query->have_posts()) {
        while ($instructors_query->have_posts()) {
            $instructors_query->the_post();
            $post_id = get_the_ID();
            if(get_post_meta($post_id, 'hide_this_profile', true)){
                $post_ids[] =  $post_id;
            }
        }
        wp_reset_postdata();
    }
    return $post_ids;
}

$hide_ides;

add_action( "wp_head", function(){
    global $hide_ides;
    $hide_ides = get_hide_ides();
});

add_action('elementor/query/instructors_query_ip', function ($query) {
    global $hide_ides;
    $query->set('post__not_in', $hide_ides);
});


function order_number(){
    $output;
    $post_id = get_the_ID();
    if(get_post_meta($post_id, 'display_order', true)){
        $output = get_post_meta($post_id, 'display_order', true);
    }else{
        $output = "";
    }
    return "order_number|" . $output;
}

add_shortcode( "order_number", "order_number" );


// Filter Review Serial

add_action('elementor/query/review_query', function ($query) {
    $query->set('post_type', 'review');
    $query->set('meta_key', 'display_order');
    $query->set('orderby', 'meta_value_num'); // Order by numeric value of display_order
    $query->set('order', 'ASC'); // Ascending order
});

// Filter Courses Serial


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
function webnear_from() {
    if ( !is_page( 5467 ) || !is_page( 9112 ) ) {
        echo do_shortcode('[elementor-template id="1897"]');
    }

    if(is_page( 8039 ) || is_page( 14563 )){
        echo do_shortcode('[elementor-template id="8766"]');
        echo '<script>
                {
                    const getDataWebNearShowBtn = document.querySelectorAll(`[href="#data_webinar_form"]`);
                    const getDataWebNearForm = document.querySelector(`.data_en_wb`);
                    const getDataWebNearFormClose = document.querySelector(`.data_web_near_close`);
                    for(let eachWebNearBtn of getDataWebNearShowBtn){
                        eachWebNearBtn.addEventListener(`click`, function(e){
                            e.preventDefault();
                            getDataWebNearForm.setAttribute(`show_status`, true);
                        })
                    }
                    getDataWebNearFormClose.addEventListener(`click`, function(){
                        getDataWebNearForm.setAttribute(`show_status`, false);
                    })
                }
            </script>';
    }
	
	   if(is_page( 11813 )){
        echo do_shortcode('[elementor-template id="13885"]');
        echo '<script>
                {
                    const getDataWebNearShowBtn = document.querySelectorAll(`[href="#data_webinar_form"]`);
                    const getDataWebNearForm = document.querySelector(`.data_en_wb`);
                    const getDataWebNearFormClose = document.querySelector(`.data_web_near_close`);
                    for(let eachWebNearBtn of getDataWebNearShowBtn){
                        eachWebNearBtn.addEventListener(`click`, function(e){
                            e.preventDefault();
                            getDataWebNearForm.setAttribute(`show_status`, true);
                        })
                    }
                    getDataWebNearFormClose.addEventListener(`click`, function(){
                        getDataWebNearForm.setAttribute(`show_status`, false);
                    })
                }
            </script>';
    }
}

add_action( 'wp_footer', 'webnear_from' );





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