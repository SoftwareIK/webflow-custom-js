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

  $("a").on("click", function () {
    var clickID = $(this).attr('id');
    var timestamp = new Date().getTime();
    const trackingObj = {
      "page_value_url": window.location.href,
      "student_uuid": generatedUserId,
      "timestamp": timestamp,
      "ClickID": clickID,
    }
    var trackingData = JSON.stringify(trackingObj);
    console.log("trackingData:", trackingData);
  });
});