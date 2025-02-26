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


function get_lp_instructor_background_color() {
    // Get the current 'lp-instructors' post ID
    $current_post_id = get_the_ID();

    // Ensure we are in the correct post type
    if (get_post_type($current_post_id) === 'lp-instructors') {
        // Get the color value from the 'background_color' ACF field
        $color = get_field('background_color', $current_post_id);

        // Return the color value or a default color
        return $color ? esc_attr($color) : '#000000'; // Default to black if no color is found
    }

    return '#000000'; // Default color if not on 'lp-instructors' post type
}
add_shortcode('instructor_color', 'get_lp_instructor_background_color');









function post_video_fild(){
    $custom_field_value = get_post_meta(get_the_ID(), 'video_embed_code', true);
    if (!empty($custom_field_value)) {
        return $custom_field_value;
    }
}

add_shortcode( 'post_video_fild', 'post_video_fild' );





// Add webnear from to the footer
function webnear_from(){
	if ( !is_page(7337) ) {
		echo do_shortcode('[elementor-template id="7088"]');
	}
}

add_action( 'wp_footer', 'webnear_from');





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

function add_geo_json_to_frontend() {
  // Get client IP
  $ip = $_SERVER['REMOTE_ADDR'];

  // Fetch geolocation data from GeoJS
  $geo_url = "https://get.geojs.io/v1/ip/geo/{$ip}.json";
  $geo_data = wp_remote_get($geo_url);

  // Decode response
  if (!is_wp_error($geo_data) && !empty($geo_data['body'])) {
      $geo_info = json_decode($geo_data['body'], true);
      $geo_json = json_encode($geo_info, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  } else {
      $geo_json = json_encode(["error" => "Unable to retrieve geolocation data"]);
  }

  // Add hidden input field with geolocation data
  echo "<input type='hidden' id='geo-data' value='" . esc_attr($geo_json) . "'>";
}

// Hook into WordPress footer
add_action('wp_footer', 'add_geo_json_to_frontend');