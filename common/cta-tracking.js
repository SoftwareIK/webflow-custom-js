$(document).ready(function () {
  function addIdToElement(selectorPrefix, textPrefix) {
    $(selectorPrefix).each(function () {
      let linkText = $(this).text().trim().toLowerCase();
      let hyphenatedText = linkText.split(' ').join('-');
      let linkID = textPrefix + hyphenatedText + "-link_redirect-new-page";
      $(this).attr('id', linkID);
    });
  }
  addIdToElement('.eng-role-link-v2', "course-list_course-");
  addIdToElement('.indian-footer-links', "footer-");
  addIdToElement('.new-footer-link', "footer-");
  addIdToElement('.footer-link', "footer-");
  addIdToElement('.footer-nav-link', "footer-");

  $("a, input[type='submit']").on("click", function () {
    setTimeout(() => {
      let clickID = $(this).attr('id');
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
              //"student_uuid": encodeURIComponent($(".user_id").val()),
              "student_uuid": visitor_id,
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