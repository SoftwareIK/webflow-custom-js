$(document).ready(function () {
  var collectionId = $('html').data('wf-collection');
  var itemSlug = $('html').data('wf-item-slug');

  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('update') && urlParams.get('update') === 'true') {
    if (collectionId && itemSlug) {
      var newUrl = `https://uplevel.interviewkickstart.com/app/cms/articles/items/${collectionId}/${itemSlug}`;
      window.location.href = newUrl;
    }
  }

  function slugContains(paths) {
    return paths.some(path => itemSlug === path);
  }

  const SWITCHUP_TYPE = 'machine-learning';

  function isCurentArticleSU() {
    if(typeof ARTICLE_TYPES !== 'undefined' && ARTICLE_TYPES !== '') {
      const articleTypesArray = ARTICLE_TYPES.split(',').map(type => type.trim().toLowerCase());
      return articleTypesArray.includes(SWITCHUP_TYPE);
    }
    return false;
  }

  // TODO: this is temp. delete this when this has article_types value. (by: keval)
  const listOfSwitchUpArticles = [
    'preparing-machine-learning-course-interview-kickstart'
  ];

  if (isCurentArticleSU() || slugContains(listOfSwitchUpArticles)) {
    $.getJSON("https://get.geojs.io/v1/ip/geo.json", function (t) { }).done(function (t) {
      if (t.country != "India" && t.timezone != 'Asia/Kolkata') {
        webinarType = "SWITCH_UP";
        $('.heading-12').text("Uplevel your career with AI/ML/GenAI");
        $('input[name="Event Name"]').val("Uplevel your career with AI/ML/GenAI");
      }
    }).fail(function (t) { });
  }
});