$(document).ready(function () {
  $(".tpc-offer-slider .course__offer-slider-left").attr("data-click-id", "tpc-offer_slider_arrow-right");
  $(".tpc-offer-slider .course__offer-slider-right").attr("data-click-id", "tpc-offer_slider_arrow-left");
  $(".tpc-career-slide .course__offer-slider-left").attr("data-click-id", "tpc-career_slider_arrow-right");
  $(".tpc-career-slide .course__offer-slider-right").attr("data-click-id", "tpc-career_slider_arrow-left");
  $(".tpc-instructor-slider-right, .tpc-instructor-slider .course__offer-slider-right-v1").attr("data-click-id", "tpc-instructor_slider_arrow-left");
  $(".tpc-instructor-slider-left, .tpc-instructor-slider .course__offer-slider-left-v1").attr("data-click-id", "tpc-instructor_slider_arrow-right");

  $(".student-swiper-block-v1 .slider-prev-btn-v3").attr("data-click-id", "success-stories_slider_arrow-right");
  $(".student-swiper-block-v1 .slider-prev-btn-v4").attr("data-click-id", "success-stories_slider_arrow-left");

  $(".student-swiper-block .slider-next-btn").attr("data-click-id", "success-stories_slider_arrow-right");
  $(".student-swiper-block .slider-prev-btn").attr("data-click-id", "success-stories_slider_arrow-left");

  $(".logo-slider-2 .prev-logo-slide").attr("data-click-id", "in-ik-logo_slider_arrow-left");
  $(".logo-slider-2 .next-logo-slide").attr("data-click-id", "in-ik-logo_slider_arrow-right");

  $(".tech-lead-block .left-slide").attr("data-click-id", "tech-lead_slider_arrow-left");
  $(".tech-lead-block .right-slide").attr("data-click-id", "tech-lead_slider_arrow-right");

  $(".interview-course-block .left-slide2").attr("data-click-id", "alumni-slider_slider_arrow-left");
  $(".interview-course-block .right-slide-2").attr("data-click-id", "alumni-slider_slider_arrow-right");

  function addIdToElement(selectorPrefix, textPrefix) {
    $(selectorPrefix).each(function () {
      let linkText = $(this).text().trim().toLowerCase();
      let hyphenatedText = linkText.split(' ').join('-');
      let linkID = textPrefix + hyphenatedText + "_link_redirect-new-page";
      $(this).attr('data-click-id', linkID);
    });
  }

  addIdToElement('.eng-role-link-v2', "course-list_course-");
  addIdToElement('.indian-footer-links', "footer-");
  addIdToElement('.new-footer-link', "footer-");
  addIdToElement('.footer-link-new', "footer-");
  addIdToElement('.footer-link', "footer-");
  addIdToElement('.footer-nav-link', "footer-");
  addIdToElement('.dropdown-link-v1', "course-card_");
  addIdToElement('.course__sections-menu-link', "course-sec-menu-");
  addIdToElement('.course__sections-menu-link-2', "course-sec-menu-");
  addIdToElement('.blog-post-body a', "blog-post-");
  addIdToElement('.nav-link', 'header-nav-link-');
  addIdToElement('.link_privacy_policy', 'webinar-modal-popup-');


  $("a, input[type='submit']").on("click", function () {
    setTimeout(() => {
      let clickID = $(this).attr('data-click-id') || $(this).attr('id');
      console.log(clickID);
      let timestamp = new Date().getTime();
      $.ajax({
        "url": "https://nlhtyrnugl.execute-api.us-west-1.amazonaws.com/prod",
        "method": "POST",
        "headers": {
          "x-api-key": "fm0X61U99b80d5SlGjrxFaWjgxIBylhX3LkfYGPN",
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "dataset_id": "Marketing_data_new_logic",
          "table_id": "all_clickstream_data",
          "data": [
            {
              "page_value_url": window.location.href,
              "student_uuid": encodeURIComponent($(".user_id").val()),
              //"student_uuid": visitor_id,
              "timestamp": timestamp,
              "ClickID": clickID,
            }
          ]
        }),
        success: function (e) {
          console.log("Success Response:", e);
        },
        error: function (xhr, status, error) {
          console.log("Error Response:", xhr.responseText);
          console.log("Status:", status);
          console.log("Error:", error);
        }
      });
    }, 1000);
  });
});