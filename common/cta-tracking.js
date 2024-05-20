$(document).ready(function () {
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
  $(".tpc-offer-slider .course__offer-slider-left").attr("data-click-id", "tpc-offer-slider-arrow-right");
  $(".tpc-offer-slider .course__offer-slider-right").attr("data-click-id", "tpc-offer-slider-arrow-left");
  $(".tpc-career-slide .course__offer-slider-left").attr("data-click-id", "tpc-career-slider-arrow-right");
  $(".tpc-career-slide .course__offer-slider-right").attr("data-click-id", "tpc-career-slider-arrow-left");
  $(".tpc-instructor-slider-right").attr("data-click-id", "tpc-instructor-slider-arrow-left");
  $(".tpc-instructor-slider-left").attr("data-click-id", "tpc-instructor-slider-arrow-right");

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