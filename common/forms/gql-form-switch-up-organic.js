let leadScoreReponse = {};
$(document).ready(function () {
  bcExitIntentOnBrowserTab = "false";
  setCookie("exitIntentBCpopup", "false");
  var utmparams = getAllUrlParams();
  dataLayer.push({
    event: "Calendly",
    enhanced_conversion_data: {
      email: decodeURIComponent(utmparams.invitee_email),
      phone_number: decodeURIComponent(utmparams.answer_1),
    },
  });
  if (v_country == "United States") {
    var int_phone5 = window.intlTelInput(
      document.querySelector("#webinar_pnumber2")
    );
  } else {
    var int_phone5 = window.intlTelInput(
      document.querySelector("#webinar_pnumber2"),
      {
        initialCountry: "auto",
        geoIpLookup: function (callback) {
          $.get(
            "https://get.geojs.io/v1/ip/country.json",
            function () { },
            "json"
          ).always(function (resp) {
            var countryCode = resp && resp.country ? resp.country : "us";
            callback(countryCode);
          });
        },
        hiddenInput: "answer_1",
        utilsScript:
          "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js",
      }
    );
  }
  // Create an array of objects with URLs
  const urlMappings = [
    {
      cta_url: 'ik.com/courses/edgeup',
      program_preview_link: '/program-preview-edgeup',
    },
    {
      cta_url: 'ik.com/courses/applied-genai',
      program_preview_link: '/program-preview-genai',
    },
    {
      cta_url: 'learn.ik/course/edgeup',
      program_preview_link: '/program-preview-edgeup',
    },
    {
      cta_url: 'learn.ik/course/applied-genai-v2',
      program_preview_link: '/program-preview-genai',
    },
  ];
  
  $(".complete-registration").click(function (e) {
    e.preventDefault();
    let phonewithccode = int_phone5.getNumber(
      intlTelInputUtils.numberFormat.E164
    );
    // Function to handle redirection
    function redirectToPreview(urlObject) {
      const matchingUrl = urlMappings.find(
        (mapping) => mapping.cta_url === urlObject.cta_url,
      );

      if (matchingUrl) {
        window.location.href = matchingUrl.program_preview_link;
      } else {
        console.log('No matching URL found to redirect to program preview.');
      }
    }
    var utmparams = getAllUrlParams();
    $("input[name='answer_1'").val(phonewithccode);
    if (!phonewithccode || $(".form-phone").val().length == 0) {
      $(".error-msg-phone").removeClass("hide");
    } else {
      $("input[name='answer_1'").val(phonewithccode);
      $(".error-msg-phone").addClass("hide");
    }
    if ($(".gql-exp-select").val() == "") {
      $(".error-msg-exp").removeClass("hide");
    } else {
      $(".work_experience").val($(".gql-exp-select").val());
      $(".error-msg-exp").addClass("hide");
    }
    if ($(".gql-domain-select").val() == "") {
      $(".error-msg-domain").removeClass("hide");
    } else {
      $(".role_domain").val($(".gql-domain-select").val());
      $(".error-msg-domain").addClass("hide");
    }

    if ($(".gql-future-plan-select").val() == "") {
      $(".error-msg-future-plan").removeClass("hide");
    } else {
      $(".future_plan").val($(".gql-future-plan-select").val());
      $(".error-msg-future-plan").addClass("hide");
    }


    if ($(".gql-starttime-select").val() == "") {
      $(".error-msg-start").removeClass("hide");
    } else {
      $(".int_start_time").val($(".gql-starttime-select").val());
      $(".error-msg-start").addClass("hide");
    }
    $(".laid_off").val($("#laidoff-flag").is(":checked"));
    if (
      $(".gql-exp-select").val() != "" &&
      $(".gql-domain-select").val() != "" &&
      $(".gql-future-plan-select").val() != "" &&
      $(".gql-starttime-select").val() != "" &&
      $(".form-phone").val() != ""
    ) {
      $(".work_experience").val($(".gql-exp-select").val());
      $(".role_domain").val($(".gql-domain-select").val());
      $(".future_plan").val($(".gql-future-plan-select").val());
      $(".int_start_time").val($(".gql-starttime-select").val());
      $(".laid_off").val($("#laidoff-flag").is(":checked"));
      var GQLformData = {
        "First Name": $(".invitee_first_name").val(),
        "Last Name": $(".invitee_last_name").val(),
        "Email Address": $(".invitee_email").val(),
        utm_source: decodeURIComponent(utmparams.utm_source),
        utm_medium: decodeURIComponent(utmparams.utm_medium),
        utm_campaign: $(".utm_campaign").val(),
        utm_term: decodeURIComponent(utmparams.utm_term),
        gclid: decodeURIComponent(utmparams.gclid),
        msclkid: decodeURIComponent(utmparams.msclkid),
        fbclid: decodeURIComponent(utmparams.fbclid),
        user_id: $(".user_id").val(),
        user_timezone: v_timezone,
        v_country: v_country,
        phone_number_full: phonewithccode,
        "Event Start Time": $(".event_start_time").val(),
        "Event End Time": $(".event_end_time").val(),
        "Work Experience": $(".work_experience").val(),
        "Role Domain": $(".gql-domain-select").val(),
        'PA Consult Time':$('.gql-paconsulttime-select').val(),
        'PA Consult Time Other':$('.gql-paconsulttime-text').val(),
        "Future Plan": $(".gql-future-plan-select").val(),
        "Interview Start Time": $(".gql-starttime-select").val(),
        "Laid Off": $("#laidoff-flag").is(":checked"),
        "Is Student": $("#is-student").is(":checked"),
        salesforce_uuid: decodeURIComponent(utmparams.salesforce_uuid),
      };
      function setDataLayer(leadScoreData) {
        dataLayer.push({
          event: "webflow_form_submitted",
          formName: "wf-form-Webinar-Signup-Last-Step",
          domain: $("#domain-role option:selected").val(),
          priority: leadScoreData?.priority,
          lead_score: leadScoreData?.lead_score,
          expected_revenue: leadScoreData?.expected_revenue
            ? parseFloat(
              leadScoreData.expected_revenue?.replace(/[^\d.-]/g, "")
            )
            : undefined,
        });
      }
      function GQLCall(leadScoreData = {}) {
        leadScoreReponse = leadScoreData;
        setDataLayer(leadScoreData);
        $.ajax({
          type: "POST",
          url: "https://hooks.zapier.com/hooks/catch/11068981/34cx4dp/",
          data: {
            ...GQLformData,
            ...leadScoreData,
          },
          success: function (e) {
            if (e.status == "success") {
              console.log("Form submitted successfully!");
              $(".gql-form").css("display", "none");
              $(".success-message-4 ").css("display", "block");
              //check if the URL is present in array if yes the redirect to program preview accordingly
              redirectToPreview({ cta_url: userData.cta_url });
            }
          },
        });
      }
      if (typeof leadScoreService === "function") {
        leadScoreService({
          api: "https://ajoably4nhpvq73kbzfkxmfnuu0eixdq.lambda-url.us-west-1.on.aws",
          data: {
            email: $(".invitee_email").val(),
            formatted_date: $(".event_start_time").val(),
            lead_email: $(".invitee_email").val(),
            channel: decodeURIComponent(utmparams?.["utm_source"]),
            role_domain: $(".role_domain").val(),
            work_ex: $(".work_experience").val(),
            interview_start_time: $(".int_start_time").val(),
            time_zone_2: v_timezone,
            webinar_date: $(".event_start_time").val(),
            device: $(".wr__device").val(),
            sale_date: null,
            alumni_stats: "New_Lead",
          },
        }, GQLCall);
      } else {
        GQLCall();
      }
    }
  });
});
