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

  $("a").on("click", function () {
    var clickID = $(this).attr('id');
    var timestamp = new Date().getTime();
    // const currentDateTime = new Date();
    // const LeadCreatedTime = currentDateTime.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, ' UTC');
    let trackingObj = [{
      "page_value_url": window.location.href,
      "student_uuid": generatedUserId,
      "timestamp": timestamp,
      "ClickID": clickID,
    }]
    // let trackingData = JSON.stringify(trackingObj);
    // console.log("trackingData:", trackingData);

    $.ajax({
      url: 'https://nlhtyrnugl.execute-api.us-west-1.amazonaws.com/prod',
      method: 'POST',
      headers: {
        'x-api-key': 'fm0X61U99b80d5SlGjrxFaWjgxIBylhX3LkfYGPN',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        dataset_id: "Marketing_data_new_logic",
        table_id: "all_clickstream_data",
        data: trackingObj,
      }),
      success: function (e) {
        console.log("Success Response:", e);
        console.log("Click_CTA_Tracking-data:", trackingObj);
      },
      error: function (xhr, status, error) {
        console.log("Error Response:", xhr.responseText);
        console.log("Status:", status);
        console.log("Error:", error);
      }
    });
  });
});