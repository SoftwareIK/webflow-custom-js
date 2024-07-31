function isBot(userAgent) {
  try {
    userAgent = userAgent || navigator.userAgent;
    const botUserAgents = [
      /bot/i, /crawl/i, /slurp/i, /spider/i, /mediapartners/i, /googlebot/i, 
      /adsbot/i, /bingbot/i, /msnbot/i, /baiduspider/i, /duckduckbot/i, 
      /yandexbot/i, /sogou/i, /exabot/i, /facebot/i, /ia_archiver/i, 
      /telegrambot/i, /whatsapp/i, /twitterbot/i, /pinterest/i, 
      /skypeuripsniffer/i, /slackbot/i, /vkshare/i, /discordbot/i
    ];
  
    return botUserAgents.some(botRegex => botRegex.test(userAgent));
  } catch (error) {
    return false;
  }

}

$(document).ready(function () {
  const sliders = [
    { selector: ".tpc-offer-slider .course__offer-slider-left", id: "tpc-offer_slider_arrow-right" },
    { selector: ".tpc-offer-slider .course__offer-slider-right", id: "tpc-offer_slider_arrow-left" },
    { selector: ".tpc-career-slide .course__offer-slider-left", id: "tpc-career_slider_arrow-right" },
    { selector: ".tpc-career-slide .course__offer-slider-right", id: "tpc-career_slider_arrow-left" },
    { selector: ".tpc-instructor-slider-right, .tpc-instructor-slider .course__offer-slider-right-v1", id: "tpc-instructor_slider_arrow-left" },
    { selector: ".tpc-instructor-slider-left, .tpc-instructor-slider .course__offer-slider-left-v1", id: "tpc-instructor_slider_arrow-right" },
    { selector: ".student-swiper-block-v1 .slider-prev-btn-v3", id: "success-stories_slider_arrow-right" },
    { selector: ".student-swiper-block-v1 .slider-prev-btn-v4", id: "success-stories_slider_arrow-left" },
    { selector: ".student-swiper-block .slider-next-btn", id: "success-stories_slider_arrow-right" },
    { selector: ".student-swiper-block .slider-prev-btn", id: "success-stories_slider_arrow-left" },
    { selector: ".logo-slider-2 .prev-logo-slide", id: "in-ik-logo_slider_arrow-left" },
    { selector: ".logo-slider-2 .next-logo-slide", id: "in-ik-logo_slider_arrow-right" },
    { selector: ".tech-lead-block .left-slide", id: "tech-lead_slider_arrow-left" },
    { selector: ".tech-lead-block .right-slide", id: "tech-lead_slider_arrow-right" },
    { selector: ".interview-course-block .left-slide2", id: "alumni-slider_slider_arrow-left" },
    { selector: ".interview-course-block .right-slide-2", id: "alumni-slider_slider_arrow-right" }
  ];
  sliders.forEach(item => {
    $(item.selector).attr("data-click-id", item.id);
  });

  //social icon CTA link 
  function addCtaIdToElement(selectorPrefix) {
    $(selectorPrefix).each(function () {
      let linkedInUserName = $(this).attr("href").split("/").splice(4, 1, 0);
      let linkDataID = `linkedin-social-icon_${linkedInUserName}_redirect-linkedIn-page`;
      $(this).attr('data-click-id', linkDataID);
    });
  }
  addCtaIdToElement('.linkedin-profile-link, .course__instructor-linkedin, .course__instructor-linkedin-2');


  //Function to add a data-click-id attribute to elements  
  function addIdToElement(selectorPrefix, textPrefix, postfix = '_link_redirect-new-page') {
    $(selectorPrefix).each(function () {
      let linkText = $(this).text().trim().toLowerCase();
      let hyphenatedText = linkText.split(' ').join('-');
      let linkID = `${textPrefix}${hyphenatedText}${postfix}`;

      $(this).attr('data-click-id', linkID);
    });
  }

  addIdToElement('.eng-role-link-v2', "course-list_course-");
  addIdToElement('.indian-footer-links', "footer-");
  addIdToElement('.new-footer-link', "footer-");
  addIdToElement('.footer-link-new', "footer-");
  addIdToElement('.jk-footer-link', "footer-");
  addIdToElement('.footer-link', "footer-");
  addIdToElement('.footer-nav-link', "footer-");
  addIdToElement('.dropdown-link-v1', "course-card_");
  addIdToElement('.course__sections-menu-link', "course-sec-menu-");
  addIdToElement('.course__sections-menu-link-2', "course-sec-menu-");
  addIdToElement('.blog-post-body a, .blog-post-body-2 a', "blog-post-");
  addIdToElement('.nav-link', 'header-nav-link-');
  addIdToElement('.link_privacy_policy', 'webinar-modal-popup-');
  addIdToElement('.w-tab-link', 'tabs-', '_in-page');
  addIdToElement('.brand', 'logo_', '_clicked_redirect');


  function fallbackClickID(element) {
    try {
      let clickID = null;
      const hrefAttr = $(element).attr('href');
      const classAttr = $(element).attr('class');
      const textContent = $(element).text().trim();
      const targetAttr = $(element).attr('target-tab');
  
      // Helper function to process href link
      function processHref(href) {
        if (href === '#') {
          return null;
        }
        if (href.startsWith('#')) {
          return `internal__${href.substring(1).replace(/\s+/g, '_')}`;
        }
        const url = new URL(href, window.location.origin); // Create URL relative to the current origin
        let hostname = url.hostname.replace(/^www\./, '');
        let pathname = url.pathname.split('/').filter(Boolean);
  
        if (pathname.length > 2) {
          pathname = pathname.slice(-3).join('_');
        } else {
          pathname = pathname.join('_');
        }
  
        return `${hostname}_${pathname}`;
      }

      if(targetAttr) {
        clickID = `section__${targetAttr.split(" ")[0].replace(/\s+/g, '_')}`;
      }
  
      // Use href link if available and not "#"
      if (hrefAttr) {
        clickID = processHref(hrefAttr);
        if (clickID) {
          clickID = `href__${clickID.replace(/\s+/g, '_').substring(0, 50)}`;
        }
      }
  
      // Use class attribute if href is not available or is "#"
      if (!clickID && classAttr) {
        clickID = `class__${classAttr.split(" ")[0].replace(/\s+/g, '_')}`;
      }
  
      // Use text content if neither href nor class is available
      if (!clickID && textContent) {
        clickID = `text__${textContent.toLowerCase().replace(/\s+/g, '_').substring(0, 50)}`;
      }
  
      return clickID;
    } catch (error) {
      console.error(error)
      return null;
    }
  }

  function callAPI(clickID, timestamp) {
    if(isBot()) {
      return;
    }
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
  }

  // Bind a click event to all anchor elements and input elements of type 'submit'
  $("a, input[type='submit']").on("click", function () {
    setTimeout(() => {
      // Get the 'data-click-id' attribute of the clicked element or its 'id' attribute
      let clickID = $(this).attr('data-click-id') || $(this).attr('data-cta-id') || $(this).attr('id');
      if (clickID === undefined || clickID.trim() === "") {
        clickID = fallbackClickID(this);
      }
      // Generate a timestamp of the current time
      let timestamp = new Date().getTime();
      // TODO: if clickId is null then we should not make the api call. but instead log it on some server.
      // Make an AJAX POST request to the specified API endpoint
      callAPI(clickID, timestamp)
    }, 1000);
  });

  // Bind a click event to all FAQs
  $(".course__faq-question, .course__faq-question-2").on("click", function () {
    try {
      setTimeout(() => {
        let parentDiv = $(this).closest('div');
        let firstChildDiv = parentDiv.children('div:first');
        let clickID = firstChildDiv.text().trim().toLowerCase().replace(/\s+/g, '_');

        if (!clickID) {
          console.error("ClickID is empty.");
          return;
        }

        let isExpanded = $(this).attr('aria-expanded') === 'true';
        let prefix = isExpanded ? "footer_faq__open__" : "footer_faq__close__";
        clickID = prefix + clickID;

        let timestamp = new Date().getTime();
        callAPI(clickID, timestamp);
      }, 1000);
    } catch (error) { console.error(error); }

  });
});