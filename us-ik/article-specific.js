$(document).ready(function () {

  function urlContains(paths) {
    const lastPathSegment = window.location.pathname.split('/').filter(segment => segment).pop();
    return paths.some(path => lastPathSegment === path);
  }

  const listOfSwitchUpArticles = [
    'preparing-machine-learning-course-interview-kickstart'
  ];

  if (urlContains(listOfSwitchUpArticles)) {
    $.getJSON("https://get.geojs.io/v1/ip/geo.json", function (t) { }).done(function (t) {
      if (t.country != "India" && t.timezone != 'Asia/Kolkata') {
        webinarType = "SWITCH_UP";
        $('.heading-12').text("Uplevel your career with AI/ML/GenAI");
        $('input[name="Event Name"]').val("Uplevel your career with AI/ML/GenAI");
      }
    }).fail(function (t) { });
  }

});