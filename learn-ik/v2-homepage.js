let upcomingWebinar;

function findNextWebinar(webinars) {
  const now = new Date();
  return webinars
    .map(webinar => new Date(webinar.utc_start_time))
    .filter(startTime => startTime > now)
    .sort((a, b) => a - b)[0];
}

function fillNextWebinarTimer() {
  const countdownElement = $('#v2-webinar-countdown');
  const miniCountDownElement = $(".v2-next-webinar-in")
  const now = new Date();
  const timeDifference = upcomingWebinar - now;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  countdownElement.html(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} Hrs`);
  miniCountDownElement.html(`${hours.toString().padStart(2, '0')} hrs`)
  setTimeout(fillNextWebinarTimer, 60000);
}

function fillWebinarSlots(data) {
  if (!data) {
    $(".v2-form-wrapper").hide();
    $(".calendly-fallback-v2").show();
    return;
  }

  upcomingWebinar = findNextWebinar(data);
  fillNextWebinarTimer();
  function generateSlotMarkup({
    day,
    dayfull,
    date,
    time,
    month,
    datetime,
    endDateTime,
    alert,
    invitee_start_time,
    invitee_end_time
  }) {

    let content = `
      <label class="v2-check w-radio">
        <input 
          type="radio" 
          name="v2-slots-radio" 
          id="slot" 
          value="${datetime}"
          data-endtime="${endDateTime}"
          data-day="${dayfull}"
          data-date="${date}"
          data-time="${time}"
          data-month="${month}"
          data-invitee_starttime="${invitee_start_time}" 
          data-invitee_endtime="${invitee_end_time}" 
          data-name="${datetime}"
          class="w-form-formradioinput checkbox v2-checkbox slot-checkbox slot-radiobutton w-radio-input" 
        >
        <div class="div-block-59 time-slot-wrapper">
          <div class="v2-day">${day}</div>
          <div class="v2-date">${date}</div>
          <div class="hr no-spacings"></div>
          <div class="v2-time">${time}</div>
        </div>
    `
    if (alert) {
      content += `
        <div class="v2-timer-alerts-wrapper ${alert.class}">
          <div class="v2-timer-alerts">
            ${alert.text}
          </div>
        </div>
      `
    }
    content += `</label>`
    return content;
  };

  const slotMarkups = [];
  data.map((slot, i) => {
    let alertMessage;
    if (i === 0) {
      alertMessage = { class: "warning-color", text: "Filling fast" }
    } else if (slot.weekday === "Saturday") {
      alertMessage = { class: "danger-color", text: "Almost full" }
    }
    slotMarkups.push(generateSlotMarkup({
      day: slot.weekday.slice(0, 3).toUpperCase(),
      dayfull: slot.weekday,
      month: slot.month,
      date: slot.day,
      time: `${slot.hour}:${slot.minute} ${slot.am_or_pm}`,
      datetime: slot.start_time,
      endDateTime: slot.end_time,
      invitee_start_time: slot.invitee_start_time,
      invitee_end_time: slot.invitee_end_time,
      alert: alertMessage
    }))
  });
  handleSlotScroll();

  $(".v2-check-container").html(slotMarkups.join(""));
}

function handleSlotScroll() {
  const $container = $('.v2-check-container');
  const $arrowRight = $('.swipe-arrow-right');
  const $arrowLeft = $('.swipe-arrow-left');
  const scrollAmount = 100;

  function updateArrows() {
    const scrollLeft = $container.scrollLeft();
    const scrollWidth = $container[0].scrollWidth;
    const containerWidth = $container.width();

    if (scrollLeft > 0) {
      $arrowLeft.removeClass("hide")
    } else {
      $arrowLeft.addClass("hide")
    }

    if (scrollLeft < scrollWidth - containerWidth) {
      $arrowRight.removeClass("hide")
    } else {
      $arrowRight.addClass("hide")
    }
  }

  $arrowRight.click(function () {
    $container.animate({ scrollLeft: '+=' + scrollAmount }, 200, updateArrows);
  });

  $arrowLeft.click(function () {
    $container.animate({ scrollLeft: '-=' + scrollAmount }, 200, updateArrows);
  });

  $container.on('scroll', updateArrows);

  // Initial check
  updateArrows();
}
function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[monthNumber - 1];
}
$(document).ready(function () {
  const SELECTED_SLOT = {};
  function pushToZap(endpoint) {
    //Zap end point for step 1
    var formData = {
      "First Name": $('#v2-fname').val(),
      "Last Name": $('#v2-lname').val(),
      "Email Address": $('#v2-email').val(),
      "ByeCalendlyType": $('.bye-calendly-type').val(),
      "webinar-type": $('.webinar-type').val(),
      "Webinar Lead Type": $('.webinar-lead-type').val(),
      "utm_source": $('.utm_source').val(),
      "utm_medium": $('.utm_medium').val(),
      "utm_campaign": $('.utm_campaign').val(),
      "utm_content": $('.utm_content').val(),
      "utm_adset": $('.utm_adset').val(),
      "utm_term": $('.utm_term').val(),

      "City": $('.wr__city').val(),
      "Device": $('.wr__device').val(),
      "Referrer": $('.wr__referrer').val(),
      "Region": $('.wr__region').val(),

      "gclid": $('.gclid').val(),
      "msclkid": $('.msclkid').val(),
      "fbclid": $('.fbclid').val(),
      "user_id": $('.user_id').val(),

      "cta_page_url": $('.cta_page_url').val(),
      "landing_page_url": $('.l_page_url').val(),
      "event_name": eventName,
      "user_timezone": $('.user_timezone').val(),
      "page_url": $('.page_url').val(),
      "site_url": $('.site_url').val(),
      "v_country": $('.v_country').val(),
      "salesforce_uuid": $('.salesforce_uuid').val(),
      "phone_number_full": $('.tno1').val(),
      "is_exit_intent_popup": $('.is_exit_intent_popup').val(),

      "Event Start Time": $('.wr__event-start-time').val(),
      "Event End Time": $('.wr__event-end-time').val(),
      "Invitee Start Time": $('.wr__invitee-start-time').val(),
      "Invitee End Time": $('.wr__invitee-end-time').val(),
      "Work Experience": $('.gql-work-experience').val(),
      "Domain or Role": $('.gql-role-domain').val(),
    };

    $.ajax({
      type: "POST",
      url: endpoint,
      data: formData,
      success: function (e) {
        if (e.status == "success") {
          console.log("Form submitted successfully!");
        }
      }
    });
  }

  var v2PhoneNumber = window.intlTelInput(document.querySelector("#v2-phone-number"), {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      $.get('https://get.geojs.io/v1/ip/country.json', function () { }, "json").always(function (resp) {
        var countryCode = (resp && resp.country) ? resp.country : "us";
        callback(countryCode);
      });
    },
    hiddenInput: "full",
    utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
  });

  function showFormSuccessSection() {
    $("#v2-success-date").html(SELECTED_SLOT.date);
    $("#v2-success-day").html(SELECTED_SLOT.day);
    $("#v2-success-month").html(SELECTED_SLOT.month)
    $("#v2-success-time").html(SELECTED_SLOT.time)
    $('.form-info').hide();
    $(".form-submitted-div").css("display", "block");
  }

  function adjustFormStep(currentStep, nextStep) {
    const currentStepContainer = $(currentStep);
    currentStepContainer.removeClass(".active-step");
    currentStepContainer.children(".v2-step-count").removeClass("active-step-count");
    currentStepContainer.children(".v2-step-name").removeClass("active-step-name");

    const nextStepContainer = $(nextStep);
    nextStepContainer.addClass(".active-step");
    nextStepContainer.children(".v2-step-count").addClass("active-step-count");
    nextStepContainer.children(".v2-step-name").addClass("active-step-name");

  }

  $(document).on('click', '.slot-radiobutton', function () {
    // Your event handling logic here
    $('.time-slot-wrapper').removeClass('selected-slot');
    $(this).siblings('.time-slot-wrapper').addClass('selected-slot');
    SELECTED_SLOT['day'] = $(this).data('day');
    SELECTED_SLOT['date'] = $(this).data('date');
    SELECTED_SLOT['time'] = $(this).data('time');
    SELECTED_SLOT['month'] = getMonthName($(this).data('month'));

    // var checkboxValue = $(this).val();
    // alert('Checkbox value: ' + checkboxValue);
  });

  $("#v2-form-2nd-back").click(function (e) {
    adjustFormStep("#form-step-2", "#form-step-1");
  });

  $("#v2-form-3rd-back").click(function (e) {
    adjustFormStep("#form-step-3", "#form-step-2");
  });

  $('#v2-form-1st-submit').click(function (e) {
    e.preventDefault();
    setHiddenFields();
    try { paRegisteredCookie(); } catch (e) { console.error(e) }
    let fullphonenumber3 = v2PhoneNumber.getNumber(intlTelInputUtils.numberFormat.E164);
    $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
    $(".tno1").val(fullphonenumber3);

    $("#v2-fname, #v2-lname, #v2-phone-number, #v2-email").keypress(function () {
      $(".v2-fname-error, .v2-lname-error, .v2-email-id-error, .v2-phone-number-error").hide();
      $("#v2-fname, #v2-lname, #v2-phone-number, #v2-email").removeClass("has-error");
    })

    $("#v2-fname, #v2-lname, #v2-phone-number, #v2-email").focus(function () {
      $(".v2-fname-error, .v2-lname-error, .v2-email-id-error, .v2-phone-number-error").hide();
      $("#v2-fname, #v2-lname, #v2-phone-number, #v2-email").removeClass("has-error");
    });

    let name_regex = new RegExp("^[a-zA-Z ]+$");
    let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

    if (($("#v2-fname").val().length == 0) &&
      ($("#v2-lname").val().length == 0) &&
      ($("#v2-email").val().length == 0) &&
      ($("#v2-phone-number").val().length == 0)) {
      $('.v2-fname-error, .v2-lname-error, .v2-email-id-error, .v2-phone-number-error').show();
    } else if (!name_regex.test($("#v2-fname").val()) || $("#v2-fname").val().length == 0) {
      $('.v2-fname-error').show();
      $('#v2-fname').addClass('has-error');
    } else if (!name_regex.test($("#v2-lname").val()) || $("#v2-lname").val().length == 0) {
      $('.v2-lname-error').show();
      $('#v2-lname').addClass('has-error');
    } else if (!phone_regex.test($("#v2-phone-number").val()) || $("#v2-phone-number").val().length == 0) {
      $('.v2-phone-number-error').show();
      $('#v2-phone-number').addClass('has-error');
    } else if (!email_regex.test($("#v2-email").val()) || $("#v2-email").val().length == 0) {
      $('.v2-email-id-error').show();
      $('#v2-email').addClass('has-error');
    } else {
      $('.v2-form-loading-bar').css("display", "flex");
      $('.wr__firstname').val($("#v2-fname").val());
      $('.wr__lastname').val($("#v2-lname").val());
      $('.wr__email').val($("#v2-email").val());
      $('.wr__phone').val(fullphonenumber3);

      dataLayer.push({
        'event': 'new_webinar_registration_form_submitted',
        'webinar_name': (document.querySelector('.webinar__lightbox-title').innerHTML)
      });

      if ($('.is_exit_intent_popup').val() == "On Scroll") {
        dataLayer.push({
          'event': 'exit_intent',
          'eventCategory': 'exit_intent_scroll',
          'eventAction': 'exit_intent_scroll',
          'eventLabel': 'form submitted'
        });
      }

      if ($('.is_exit_intent_popup').val() == "Browser Tab") {
        dataLayer.push({
          'event': 'exit_intent',
          'eventCategory': 'exit_intent_browser_tab_close_gesture',
          'eventAction': 'exit_intent_browser_tab_close_gesture',
          'eventLabel': 'form submitted'
        });
      }

      pushToZap("https://hooks.zapier.com/hooks/catch/11068981/340hd4j/");

      $('#wf-webinar-1-step-v2').submit();
      $('.v2-first-form-block').hide();
      adjustFormStep("#form-step-1", "#form-step-2");
      setTimeout(function () {
        $('.v2-first-form-block').hide();
        $(".v2-second-form-block").show();
        $('.v2-form-loading-bar').hide();
      }, 200);
    }
    $("input:radio[name='v2-slots-radio']:first").attr("checked", true);
    $('.wr__event-start-time').val($("input:radio[name='v2-slots-radio']:first").val());
    $('.wr__event-end-time').val($("input:radio[name='v2-slots-radio']:first").data('endtime'));
    $('.wr__invitee-start-time').val($("input:radio[name='v2-slots-radio']:first").data('invitee_starttime'));
    $('.wr__invitee-end-time').val($("input:radio[name='v2-slots-radio']:first").data('invitee_endtime'));
    $('.webinar-lead-type').val($("input:radio[name='v2-slots-radio']:first").data('webinar_lead_type'));
  })

  $('#v2-form-2nd-submit').click(function (e) {
    e.preventDefault();

    if ($("input:radio[name='v2-slots-radio']").is(":checked")) {
      try { paRegisteredCookie(); } catch (e) { console.error(e) }

      const startDate = $('input[name="v2-slots-radio"]:checked').val();
      const endDate = $('input[name="v2-slots-radio"]:checked').data("endtime");

      function updateFormFields() {
        $(".wr__event-start-time").val(startDate);
        $(".wr__event-end-time").val(endDate);
        $(".wr__invitee-start-time").val($('input[name="v2-slots-radio"]:checked').data("invitee_starttime"));
        $(".wr__invitee-end-time").val($('input[name="v2-slots-radio"]:checked').data("invitee_endtime"));
        $(".webinar-lead-type").val($('input[name="v2-slots-radio"]:checked').data("webinar_lead_type"));
      }

      function formatDate(dateTime) {
        return dateTime.toISOString().replace(/T/, " ").replace(/\.\d+Z$/, " UTC");
      }

      if (typeof paRegistered !== "undefined") {
        updateFormFields();
        $(".v2-form-loading-bar").show();
        pushToZap("https://hooks.zapier.com/hooks/catch/11068981/307qti9/");
      } else {
        updateFormFields();
        $(".v2-form-loading-bar").show();
        pushToZap("https://hooks.zapier.com/hooks/catch/11068981/340hl1a/");
      }

      bake_cookie("v_history", "");
      bake_cookie("v_latest", "");

      $('#wf-webinar-2-step-v2').submit();
      $(".v2-second-form-block").hide();
      adjustFormStep("#form-step-2", "#form-step-3");
      setTimeout(function () {
        $('.v2-form-loading-bar').hide();
        $(".v2-third-form-block").show();
        GQLFormVisible();
      }, 200);

    }

    gqlFormCookieData();

    // Lead Creation Time
    const currentDateTime = new Date();
    const leadCreatedTime = formatDate(currentDateTime);

    function submitLeadData(leadCreatedTime) {
      const formattedStartDateTime = formatDate($(".wr__event-start-time").val());
      const formattedEndDateTime = formatDate($(".wr__event-end-time").val());

      $.ajax({
        url: "https://nlhtyrnugl.execute-api.us-west-1.amazonaws.com/prod",
        method: "POST",
        headers: {
          "x-api-key": "fm0X61U99b80d5SlGjrxFaWjgxIBylhX3LkfYGPN",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          dataset_id: "Marketing_data_new_logic",
          table_id: "Leads_Click_history",
          data: [{
            Lead_Created_Time: leadCreatedTime,
            Lead_Name: `${$(".wr__firstname").val()} ${$(".wr__lastname").val()}`,
            Lead_First_Name: $(".wr__firstname").val(),
            Lead_Last__Name: $(".wr__firstname").val(),
            Lead_Email: $(".wr__email").val(),
            Lead_Time_Zone: $(".user_timezone").val(),
            Event_Type_Name: eventName,
            Event_Start_Date_Time: formattedStartDateTime,
            Event_End_Date_Time: formattedEndDateTime,
            Cancellation_reason: "",
            Mobile: $(".wr__phone").val(),
            UTM_Campaign: $(".utm_campaign").val(),
            UTM_Source: $(".utm_source").val(),
            UTM_Medium: $(".utm_medium").val(),
            UTM_Term: $(".utm_term").val(),
            UTM_Content: $(".utm_content").val(),
            Tracking_ID: "",
            User_ID: encodeURIComponent($(".user_id").val()),
            Page_URL: $(".page_url").val(),
            Country: $(".v_country").val(),
            Client_Timezone: $(".user_timezone").val(),
            CTA_Page: encodeURIComponent($(".cta_page_url").val()),
            Landing_Page: encodeURIComponent($(".l_page_url").val()),
            Webinar_reg_type: $(".bye-calendly-type").val(),
            Webinar_Type: $(".webinar-type").val(),
            Switchup_Lead: $(".webinar-lead-type").val(),
            UUID: $(".salesforce_uuid").val(),
            Click_History: "",
            City: $(".wr__city").val(),
            Device: $(".wr__device").val(),
            Refferer: encodeURIComponent($(".wr__referrer").val()),
            Region: $(".wr__region").val(),
          }],
        }),
        success: function (response) {
          console.log("Success Response:", response);
        },
        error: function (xhr, status, error) {
          console.log("Error Response:", xhr.responseText);
          console.log("Status:", status);
          console.log("Error:", error);
        },
      });
    }
    // AJAX call to submit lead data
    submitLeadData(leadCreatedTime);
  });

  function GQLFormVisible() {
    const data = {
      firstName: $(".wr__firstname").val(),
      lastName: $(".wr__lastname").val(),
      email: $(".wr__email").val(),
      phone: $(".wr__phone").val(),
      city: $(".wr__city").val(),
      device: $(".wr__device").val(),
      region: $(".wr__region").val(),
      referrer: $(".wr__referrer").val(),
      site_url: $(".site_url").val(),
      eventStartTime: $(".wr__event-start-time").val(),
      eventEndTime: $(".wr__event-end-time").val(),
      inviteeStartTime: $(".wr__invitee-start-time").val(),
      inviteeEndTime: $(".wr__invitee-end-time").val(),
      learnUserId: $(".user_id").val(),
      event_name: eventName,
      cta_url: "learn.ik" + window.location.pathname,
    };

    dataLayer.push({
      event: "Calendly",
      enhanced_conversion_data: {
        email: decodeURIComponent(data.email),
        phone_number: decodeURIComponent(data.phone),
      },
    });
    $(".invitee_first_name").val(data.firstName);
    $(".invitee_last_name").val(data.lastName);
    $(".invitee_email").val(data.email);
    $(".answer_1").val(data.phone);
    $(".event_start_time").val(data.eventStartTime);
    $(".event_end_time").val(data.eventEndTime);
    $(".user_id").val(data.learnUserId);
    $(".wr__referrer").val(data.referrer);
    $(".site_url").val(data.site_url);
    $(".event_name").val(data.event_name);

    window.enhancedUserData = {
      email: data.email,
      phone_number: data.phone,
    };
  }

  $('#v2-form-3rd-submit').click(function (e) {
    e.preventDefault();
    let utmparams = {
      "utm_source": $('.utm_source').val(),
      "utm_medium": $('.utm_medium').val(),
      "utm_campaign": $('.utm_campaign').val(),
      "utm_content": $('.utm_content').val(),
      "utm_adset": $('.utm_adset').val(),
      "utm_term": $('.utm_term').val(),
      "gclid": $('.gclid').val(),
      "msclkid": $('.msclkid').val(),
      "fbclid": $('.fbclid').val(),
      "user_id": $('.user_id').val(),
      "salesforce_uuid": $('.salesforce_uuid').val(),
    }

    const data = {
      firstName: $(".wr__firstname").val(),
      lastName: $(".wr__lastname").val(),
      email: $(".wr__email").val(),
      phone: $(".wr__phone").val(),
      city: $(".wr__city").val(),
      device: $(".wr__device").val(),
      region: $(".wr__region").val(),
      referrer: $(".wr__referrer").val(),
      site_url: $(".site_url").val(),
      eventStartTime: $(".wr__event-start-time").val(),
      eventEndTime: $(".wr__event-end-time").val(),
      inviteeStartTime: $(".wr__invitee-start-time").val(),
      inviteeEndTime: $(".wr__invitee-end-time").val(),
      learnUserId: $(".user_id").val(),
      event_name: eventName,
      cta_url: "learn.ik" + window.location.pathname,
    };

    if ($("#v2-Experience").val() == "") {
      $(".v3-experience-error").removeClass("hide");
    } else {
      $(".work_experience").val($("#v2-Experience").val());
      $(".v3-experience-error").addClass("hide");
    }
    if ($("#v2-domain-role").val() == "") {
      $(".v3-domain-error").removeClass("hide");
    } else {
      $(".role_domain").val($("#v2-domain-role").val());
      $(".v3-domain-error").addClass("hide");
    }
    if ($("#v2-Start-Interviewing").val() == "") {
      $(".v3-plan-error").removeClass("hide");
    } else {
      $(".int_start_time").val($("#v2-Start-Interviewing").val());
      $(".v3-plan-error").addClass("hide");
    }
    $(".laid_off").val($("#checkbox-is-laid-off-v2").is(":checked"));
    if (
      $("#v2-Experience").val() != "" &&
      $("#v2-domain-role").val() != "" &&
      $("#v2-Start-Interviewing").val() != ""
    ) {
      $(".work_experience").val($("#v2-Experience").val());
      $(".role_domain").val($("#v2-domain-role").val());
      $(".int_start_time").val($("#v2-Start-Interviewing").val());
      $(".laid_off").val($("#checkbox-is-laid-off-v2").is(":checked"));
      var GQLformData = {
        "First Name": data.firstName,
        "Last Name": data.lastName,
        "Email Address": data.email,
        utm_source: decodeURIComponent(utmparams.utm_source),
        utm_medium: decodeURIComponent(utmparams.utm_medium),
        utm_campaign: decodeURIComponent(utmparams.utm_campaign),
        utm_term: decodeURIComponent(utmparams.utm_term),
        gclid: decodeURIComponent(utmparams.gclid),
        msclkid: decodeURIComponent(utmparams.msclkid),
        fbclid: decodeURIComponent(utmparams.fbclid),
        user_id: data.learnUserId,
        user_timezone: v_timezone,
        v_country: v_country,
        phone_number_full: data.phone,
        "Event Start Time": data.eventStartTime,
        "Event End Time": data.eventEndTime,
        "Work Experience": $("#v2-Experience").val(),
        "Role Domain": $("#v2-domain-role").val(),
        "Interview Start Time": $("#v2-Start-Interviewing").val(),
        "Laid Off": $("#checkbox-is-laid-off-v2").is(":checked"),
        "Is Student": $("#is-student-v2").is(":checked"),
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
              $(".v2-form-container").css("display", "none");
              showFormSuccessSection();
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