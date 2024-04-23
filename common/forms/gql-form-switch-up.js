let leadScoreReponse = {};
bcExitIntentOnBrowserTab = "false";
$(document).ready(function () {
  var utmparams = getAllUrlParams();
  setCookie("exitIntentBCpopup", "false");
  dataLayer.push({
    event: "Calendly",
    enhanced_conversion_data: {
      email: decodeURIComponent(utmparams.invitee_email),
      phone_number: decodeURIComponent(utmparams.answer_1),
    },
  });
  var previousData = getCookie("previousData");
  if (previousData !== null) {
    var decodedData = decodeURIComponent(previousData);
    var decodedObject = JSON.parse(decodedData);
    console.log("previousData", decodedObject);
    $(".invitee_first_name").val(decodedObject.firstName);
    $(".invitee_last_name").val(decodedObject.lastName);
    $(".invitee_email").val(decodedObject.email);
    $(".answer_1").val(decodedObject.phone);
    $(".event_start_time").val(decodedObject.eventStartTime);
    $(".event_end_time").val(decodedObject.eventEndTime);
    $(".user_id").val(decodedObject.learnUserId);
    $(".wr__referrer").val(decodedObject.referrer);
    $(".site_url").val(decodedObject.site_url);
    $(".event_name").val(decodedObject.event_name);
  } else {
    console.log("Cookie not found");
  }
  window.enhancedUserData = {
    email: decodedObject.email,
    phone_number: decodedObject.phone,
  };
  console.log("enhancedUserData", enhancedUserData);
});

var hasInteracted = !1;
$("#Experience").change(function () {
  hasInteracted = !0;
  let e = $(this).val();
  hasInteracted && (e ? $(".error-msg-exp").hide() : $(".error-msg-exp").show());
});

$("#domain-role").change(function () {
  hasInteracted = !0;
  let e = $(this).val();
  hasInteracted &&
    (e ? $(".error-msg-domain").hide() : $(".error-msg-domain").show());
});

$(".complete-registration").click(function (e) {
  e.preventDefault();
  let utmparams = getAllUrlParams();
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
    $(".gql-starttime-select").val() != ""
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
      utm_campaign: decodeURIComponent(utmparams.utm_campaign),
      utm_term: decodeURIComponent(utmparams.utm_term),
      gclid: decodeURIComponent(utmparams.gclid),
      msclkid: decodeURIComponent(utmparams.msclkid),
      fbclid: decodeURIComponent(utmparams.fbclid),
      user_id: $(".user_id").val(),
      user_timezone: v_timezone,
      v_country: v_country,
      phone_number_full: $(".answer_1").val(),
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
            leadScoreData?.expected_revenue?.replace(/[^\d.-]/g, "")
          )
          : undefined,
      });
    }
    function GQLCall(leadScoreData = {}) {
      leadScoreReponse = leadScoreData;
      setDataLayer(leadScoreData);
      $.ajax({
        type: "POST",
        url: "https://hooks.zapier.com/hooks/catch/11068981/3409hxu/",
        data: {
          ...GQLformData,
          ...leadScoreData,
        },
        success: function (e) {
          if (e.status == "success") {
            console.log("Form submitted successfully step3!");
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
