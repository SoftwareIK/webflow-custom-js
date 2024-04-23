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
  // $(".gql-step2-cta").click(function (e) {
  //   e.preventDefault();
  //   var utmparams = getAllUrlParams();
  //   if ($(".gql-switch-domain").val() == "") {
  //     $(".error-msg-switchdomain").removeClass("hide");
  //   } else {
  //     $(".switch_domain").val($(".gql-switch-domain").val());
  //     $(".error-msg-switchdomain").addClass("hide");
  //   }
  //   if ($(".gql-switch-domain").val() != "") {
  //     let phonewithccode = int_phone5.getNumber(
  //       intlTelInputUtils.numberFormat.E164
  //     );
  //     dataLayer.push({
  //       event: "webflow_form_submitted",
  //       formName: "wf-form-Switch-Domain-Form",
  //       domain: $("#domain-role option:selected").val(),
  //     });
  //     var GQLformData = {
  //       "First Name": $(".invitee_first_name").val(),
  //       "Last Name": $(".invitee_last_name").val(),
  //       "Email Address": $(".invitee_email").val(),
  //       utm_source: decodeURIComponent(utmparams.utm_source),
  //       utm_medium: decodeURIComponent(utmparams.utm_medium),
  //       utm_campaign: $(".utm_campaign").val(),
  //       utm_term: decodeURIComponent(utmparams.utm_term),
  //       gclid: decodeURIComponent(utmparams.gclid),
  //       msclkid: decodeURIComponent(utmparams.msclkid),
  //       fbclid: decodeURIComponent(utmparams.fbclid),
  //       user_id: $(".user_id").val(),
  //       user_timezone: v_timezone,
  //       v_country: v_country,
  //       phone_number_full: phonewithccode,
  //       "Event Start Time": $(".event_start_time").val(),
  //       "Event End Time": $(".event_end_time").val(),
  //       "Work Experience": $(".work_experience").val(),
  //       "Role Domain": $(".gql-domain-select").val(),
  //       "Interview Start Time": $(".gql-starttime-select").val(),
  //       "Laid Off": $("#laidoff-flag").is(":checked"),
  //       "Is Student": $("#is-student").is(":checked"),
  //       "Domain Switch": $(".gql-switch-domain").val(),
  //       "Ryan Video": $(".ryan_video").val(),
  //       salesforce_uuid: decodeURIComponent(utmparams.salesforce_uuid),
  //     };
  //     $.ajax({
  //       type: "POST",
  //       url: "https://hooks.zapier.com/hooks/catch/11068981/340arrq/",
  //       data: GQLformData,
  //       success: function (e) {
  //         console.log("e.status", e.status);
  //         if (e.status == "success") {
  //           console.log("Form submitted successfully!");
  //           $(".domain-switch-form-el").css("display", "none");
  //           $(".social-network-form-el").css("display", "block");
  //         }
  //       },
  //     });
  //   }
  // });
  $(".complete-registration").click(function (e) {
    e.preventDefault();
    let phonewithccode = int_phone5.getNumber(
      intlTelInputUtils.numberFormat.E164
    );
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
      $(".gql-starttime-select").val() != "" &&
      $(".form-phone").val() != ""
    ) {
      $(".work_experience").val($(".gql-exp-select").val());
      $(".role_domain").val($(".gql-domain-select").val());
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
              $(".webinar-signup-laststep-form").css("display", "none");
              $(".success-message-4 ").css("display", "block");
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
  // $(".social-network-form").submit(function (e) {
  //   e.prev;
  //   entDefault();
  //   let utmparams = getAllUrlParams();
  //   let phonewithccode = int_phone5.getNumber(
  //     intlTelInputUtils.numberFormat.E164
  //   );
  //   var GQLformData = {
  //     "First Name": $(".invitee_first_name").val(),
  //     "Last Name": $(".invitee_last_name").val(),
  //     "Email Address": $(".invitee_email").val(),
  //     utm_source: decodeURIComponent(utmparams.utm_source),
  //     utm_medium: decodeURIComponent(utmparams.utm_medium),
  //     utm_campaign: $(".utm_campaign").val(),
  //     utm_term: decodeURIComponent(utmparams.utm_term),
  //     gclid: decodeURIComponent(utmparams.gclid),
  //     msclkid: decodeURIComponent(utmparams.msclkid),
  //     fbclid: decodeURIComponent(utmparams.fbclid),
  //     user_id: $(".user_id").val(),
  //     user_timezone: v_timezone,
  //     v_country: v_country,
  //     phone_number_full: phonewithccode,
  //     "Event Start Time": $(".event_start_time").val(),
  //     "Event End Time": $(".event_end_time").val(),
  //     "Work Experience": $(".work_experience").val(),
  //     "Role Domain": $(".gql-domain-select").val(),
  //     "Interview Start Time": $(".gql-starttime-select").val(),
  //     "Laid Off": $("#laidoff-flag").is(":checked"),
  //     "Is Student": $("#is-student").is(":checked"),
  //     "Domain Switch": $(".gql-switch-domain").val(),
  //     "hear about IK": $(".hear-about-ik").val(),
  //     "Ryan Video": $(".ryan_video").val(),
  //     salesforce_uuid: decodeURIComponent(utmparams.salesforce_uuid),
  //   };
  //   $.ajax({
  //     type: "POST",
  //     url: "https://hooks.zapier.com/hooks/catch/11068981/3ib11qu/",
  //     data: GQLformData,
  //     success: function (e) {
  //       if (e.status == "success") {
  //         setTimeout(function () {
  //           $(".success-message-6").css("display", "block");
  //         }, 2000);
  //         $(".domain-switch-form-el").css("display", "none");
  //         console.log("Form submitted successfully step3!");
  //       }
  //     },
  //   });
  // });
});
