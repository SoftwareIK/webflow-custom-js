let upcomingWebinar;

function adjustFormStep(currentStep, nextStep) {
  $(currentStep).removeClass("v3-step-active")
  $(nextStep).addClass("v3-step-active")
}

function openForm() {
  $("body").css("overflow","hidden");
  $(".v2-first-form-block").show();
  $(".v2-second-form-block").hide();
  $(".v2-third-form-block").hide();
  $("#v2-form-container").show();
  $("#form-popup-container").css("display", "flex");
  $("#form-wrapper").css("display", "flex");
  $("#form-submitted-div").css("display", "none");
  adjustFormStep("#2-step-indicator", "#1-step-indicator");
  adjustFormStep("#3-step-indicator", "#1-step-indicator");
}

function closeForm() {
  $("body").css("overflow","scroll")
  $("#form-popup-container").css("display", "none");
}

(function () {
  let hasScrolledDown = false;

  function getScrollPercentage() {
      return (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  }

  function showHeader() {
      const headerWrapper = document.querySelector('.header-wrapper');
      if (!headerWrapper) return;

      const whiteLogo = headerWrapper.querySelector('.white-logo');
      if (whiteLogo) whiteLogo.style.display = 'none';

      const coloredLogo = headerWrapper.querySelector('.colored-logo');
      if (coloredLogo) coloredLogo.style.display = 'inline-block';

      const headerSection = headerWrapper.querySelector('.header-section');
      if (headerSection) headerSection.style.backgroundColor = 'white';

      const headerShadow = headerWrapper.querySelector('.header-shadow');
      if (headerShadow) headerShadow.style.display = 'block';
  }

  function hideHeader() {
      const headerWrapper = document.querySelector('.header-wrapper');
      if (!headerWrapper) return;

      const whiteLogo = headerWrapper.querySelector('.white-logo');
      if (whiteLogo) whiteLogo.style.display = 'inline-block';

      const coloredLogo = headerWrapper.querySelector('.colored-logo');
      if (coloredLogo) coloredLogo.style.display = 'none';

      const headerSection = headerWrapper.querySelector('.header-section');
      if (headerSection) headerSection.style.backgroundColor = '';

      const headerShadow = headerWrapper.querySelector('.header-shadow');
      if (headerShadow) headerShadow.style.display = 'none';
  }

  window.addEventListener('scroll', () => {
      const scrollPercentage = getScrollPercentage();

      if (scrollPercentage >= 2 && !hasScrolledDown) {
          showHeader();
          hasScrolledDown = true;
      } else if (scrollPercentage < 2 && hasScrolledDown) {
          hideHeader();
          hasScrolledDown = false;
      }
  });
})();

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
  const timezoneElement = $("#v2-timezone");
  const now = new Date();
  const timeDifference = upcomingWebinar - now;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  timezoneElement.html(`Time Zone: ${timezone}`);
  countdownElement.html(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} Hrs`);
  miniCountDownElement.html(`${hours.toString().padStart(2, '0')} hrs`)
  setTimeout(fillNextWebinarTimer, 60000);
}

function fallbackToCelendlly() {
  $(".v2-form-wrapper").hide();
  $(".calendly-fallback-v2").show();
}

function fillWebinarSlots(data) {
  if(is_webinar_1o1_eligible){
    $('.webinar__slots').show();
    $(".v2-check-container").hide();
    return;
  } else {
    $('.webinar__slots').remove();
    $(".v2-check-container").css("display", "grid");
  }
  
  if (!data || data.length == 0) {
    fallbackToCelendlly();
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
    invitee_end_time,
    active = false
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
        <div class="div-block-59 time-slot-wrapper ${active ? "selected-slot" : ""}">
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
  const firstSlot = data[0] ?? undefined;

  if (window.skipSecondSteps){
    if(firstSlot) {
        slotMarkups.push(generateSlotMarkup({
            day: firstSlot?.weekday.slice(0, 3).toUpperCase(),
            dayfull: firstSlot?.weekday,
            month: firstSlot?.month,
            date: firstSlot?.day,
            time: `${firstSlot?.hour}:${firstSlot?.minute} ${firstSlot?.am_or_pm}`,
            datetime: firstSlot?.start_time,
            endDateTime: firstSlot?.end_time,
            invitee_start_time: firstSlot?.invitee_start_time,
            invitee_end_time: firstSlot?.invitee_end_time,
            alert: "",
            active: true
         }));
    };


  }else {

        data.slice(0, 6).map((slot, i) => {
            let alertMessage;
            if (i === 0) {
            alertMessage = { class: "warning-color", text: "Filling fast" }
            } else if (slot.weekday === "Saturday") {
            alertMessage = { class: "danger-color", text: "Almost full" }
            }
            slotMarkups.push(generateSlotMarkup({
            day: firstSlot.weekday.slice(0, 3).toUpperCase(),
            dayfull: firstSlot.weekday,
            month: firstSlot.month,
            date: firstSlot.day,
            time: `${firstSlot.hour}:${firstSlot.minute} ${firstSlot.am_or_pm}`,
            datetime: firstSlot.start_time,
            endDateTime: firstSlot.end_time,
            invitee_start_time: firstSlot.invitee_start_time,
            invitee_end_time: firstSlot.invitee_end_time,
            alert: alertMessage,
            active: true
            }))
        });
  }

handleSlotScroll();
$(".v2-check-container").html(slotMarkups.join(""));
}

function webinar1o1Fallback() {
  try {
    is_webinar_1o1_eligible = false;
    webinarType = "REGULAR";
    $(".webinar-lead-type").val("REGULAR");
    $(".webinar-type").val("REGULAR");
    callCreateWebinarSlot(webinarType);
  } catch (error) {
    fallbackToCelendlly();
  }
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

function formatDate(dateTime) {
  return dateTime.toISOString().replace(/T/, " ").replace(/\.\d+Z$/, " UTC");
}

$(document).ready(function () {
  const SELECTED_SLOT = {};
  window.VWO = window.VWO || [];
  VWO.event = VWO.event || function () { VWO.push(["event"].concat([].slice.call(arguments))) };
  function pushToZap(endpoint) {
    const eventStartTime = window?.defaultSlotForShortPage?.eventStartTime;
	const eventEndTime = window?.defaultSlotForShortPage?.eventEndTime;
	const inviteeStartTime =  window?.defaultSlotForShortPage?.inviteeStartTime;
	const inviteeEndTime = window?.defaultSlotForShortPage?.inviteeEndTime;
    //Zap end point for step 1
    var formData = {
      "First Name": $('#v2-fname').val(),
      "Last Name": $('#v2-lname').val(),
      "Email Address": $('#v2-email').val(),
      "ByeCalendlyType": $('.bye-calendly-type').val(),
      "webinar-type": $('.webinar-type').val(),
      "Webinar Lead Type": $('.webinar-type').val(),
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
      "event_name": window.eventNameForWebinarType,
      "user_timezone": $('.user_timezone').val(),
      "page_url": $('.page_url').val(),
      "site_url": $('.site_url').val(),
      "v_country": $('.v_country').val(),
      "salesforce_uuid": $('.salesforce_uuid').val(),
      "phone_number_full": $('.tno1').val(),
      "is_exit_intent_popup": $('.is_exit_intent_popup').val(),

      "Event Start Time": $('.wr__event-start-time').val() ? $('.wr__event-start-time').val() : eventStartTime,
      "Event End Time": $('.wr__event-end-time').val() ? $('.wr__event-end-time').val() : eventEndTime,
      "Invitee Start Time": $('.wr__invitee-start-time').val() ? $('.wr__invitee-start-time').val() : inviteeStartTime,
      "Invitee End Time": $('.wr__invitee-end-time').val() ? $('.wr__invitee-end-time').val() : inviteeEndTime,
      "Work Experience": $('.gql-work-experience').val(),
      "Domain or Role": $('.gql-role-domain').val(),
      "Booking id": $('input[name="start-date"]:checked').data("bookingid")
    };

    // const partnerDetails = read_cookie("partner_details");
    // if(partnerDetails) {
    //   formData["Partner Name"] = partnerDetails?.partner_name;
    //   formData["is_partnership_lead"] = partnerDetails?.is_partnership_lead
    //   formData["is_user_eligible_for_partnership_discount"] = partnerDetails?.is_user_eligible_for_partnership_discount
    // }
    
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

  function getPhoneNumber() {
    let phone = "";
    try {
      if(typeof(intlTelInputUtils) == "undefined") {
        phone = `+${v2PhoneNumber.getSelectedCountryData().dialCode}${$("#v2-phone-number").val()}`
       } else {
        phone = v2PhoneNumber.getNumber(intlTelInputUtils.numberFormat.E164);
      }
    } catch (error) {
      phone = $("#v2-phone-number")?.val();
    }
    return phone
  }

  function showFormSuccessSection() {
    if(window.skipSecondSteps) {
        // if we want daynamic date piking on success model then uncomment bellow code 
        // const radioInput = $('input[name="v2-slots-radio"]:checked')
        // const day = radioInput.data('day');
        // const date = radioInput.data('date');
        // const time = radioInput.data('time');
        // const month = getMonthName(radioInput.data('month'))
        // SELECTED_SLOT['day'] = day;
        // SELECTED_SLOT['date'] = date;
        // SELECTED_SLOT['time'] = time;
        // SELECTED_SLOT['month'] = month;
    }
    $("#v2-success-date").html(SELECTED_SLOT.date);
    $("#v2-success-day").html(SELECTED_SLOT.day);
    $("#v2-success-month").html(SELECTED_SLOT.month)
    $("#v2-success-time").html(SELECTED_SLOT.time)
    $('#form-wrapper').hide();
    $("#form-submitted-div").css("display", "block");
  }

  if (window.MutationObserver) {
    // Function to handle mutation
    function handleMutation(mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          var target = $(mutation.target);
          if (target.css('display') === 'none') {
            target.css('display', 'block');
            $('.v2-form-error-message').css('display', 'none');
            $('.v2-form-success-message').css('display', 'none');
          }
        }
      });
    }
    // Create an observer instance
    var observer = new MutationObserver(handleMutation);

    // Configuration of the observer
    var config = { attributes: true, attributeFilter: ['style'] };

    // Observe all forms under #v2-form-container
    $('#v2-form-container form').each(function () {
      observer.observe(this, config);
    });
  }

  $(".open-form").click(openForm)
  $(".close-form").click(closeForm)

  $("#v2-full-name").on("input", function () {
    var fullName = $.trim($(this).val());

    if (fullName === "") {
      $("#v2-fname").val("");
      $("#v2-lname").val("");
    } else {
      var nameParts = fullName.split(/\s+/);
      var firstName = nameParts[0];
      var lastName = "";

      if (nameParts.length > 1) {
        lastName = nameParts.slice(1).join(" ");
      }

      $("#v2-fname").val(firstName);
      $("#v2-lname").val(lastName || firstName);
    }
  });

    $(document).on('click', '.slot-radiobutton', function () {
      $('.time-slot-wrapper').removeClass('selected-slot');
      $(this).siblings('.time-slot-wrapper').addClass('selected-slot');
      SELECTED_SLOT['day'] = $(this).data('day');
      SELECTED_SLOT['date'] = $(this).data('date');
      SELECTED_SLOT['time'] = $(this).data('time');
      SELECTED_SLOT['month'] = getMonthName($(this).data('month'));
    });



  $("#v2-form-2nd-back").click(function (e) {
    $(".v2-second-form-block").hide();
    $(".v2-first-form-block").show();
    adjustFormStep("#2-step-indicator", "#1-step-indicator");
  });

  $("#v2-form-3rd-back").click(function (e) {
    $(".v2-third-form-block").hide();
    if(window.skipSecondSteps) {
        $(".v2-second-form-block").hide();
        $(".v2-first-form-block").show();
    }else {
        $(".v2-second-form-block").show();
    }
    adjustFormStep("#3-step-indicator", "#2-step-indicator");
  });

  $('#v2-form-1st-submit').click(async function (e) {
    e.preventDefault();
    setHiddenFields();
    try { paRegisteredCookie(); } catch (e) { console.error(e) }

    let fullphonenumber3 = getPhoneNumber();
    let validationError = false;
    $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
    $(".tno1").val(fullphonenumber3);

    $("#v2-full-name, #v2-phone-number, #v2-email").keypress(function () {
      $(".v2-full-name-error, .v2-email-id-error, .v2-phone-number-error").hide();
      $("#v2-full-name, #v2-phone-number, #v2-email").removeClass("has-error");
      validationError = false;
    })

    $("#v2-full-name, #v2-phone-number, #v2-email").focus(function () {
      $(".v2-full-name-error, .v2-email-id-error, .v2-phone-number-error").hide();
      $("#v2-full-name, #v2-phone-number, #v2-email").removeClass("has-error");
      validationError = false;
    });

    let name_regex = new RegExp("^[a-zA-Z ]+$");
    let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

    if (($("#v2-fname").val().length == 0) &&
      ($("#v2-email").val().length == 0) &&
      ($("#v2-phone-number").val().length == 0)) {
      $('.v2-full-name-error, .v2-email-id-error, .v2-phone-number-error').show();
      validationError = true;
    } else if (!name_regex.test($("#v2-fname").val()) || $("#v2-fname").val().length == 0) {
      $('.v2-full-name-error').show();
      $('#v2-full-name').addClass('has-error');
      validationError = true;
    } else if (!phone_regex.test($("#v2-phone-number").val()) || $("#v2-phone-number").val().length == 0) {
      $('.v2-phone-number-error').show();
      $('#v2-phone-number').addClass('has-error');
      validationError = true;
    } else if (!email_regex.test($("#v2-email").val()) || $("#v2-email").val().length == 0) {
      $('.v2-email-id-error').show();
      $('#v2-email').addClass('has-error');
      validationError = true;
    } else {
      $('.v2-form-loading-bar').css("display", "flex");
      $('.wr__firstname').val($("#v2-fname").val());
      $('.wr__lastname').val($("#v2-lname").val());
      $('.wr__email').val($("#v2-email").val());
      $('.wr__phone').val(fullphonenumber3);

      dataLayer.push({
        'event': 'new_webinar_registration_form_submitted',
        'webinar_name': eventName
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

      if (is_webinar_1o1_eligible) {
        $(".webinar-lead-type").val("ONE_TO_ONE_CONNECT");
      }

      pushToZap("https://hooks.zapier.com/hooks/catch/11068981/340hd4j/");

      $('#wf-webinar-1-step-v2').submit();
      $('.v2-first-form-block').hide();
      adjustFormStep("#1-step-indicator", "#2-step-indicator");
      setTimeout(function () {
        $('.v2-first-form-block').hide();
        if (window.skipSecondSteps){
            $(".v2-second-form-block").hide();
        }
        else{
            $(".v2-second-form-block").show();
        }
        $(".v2-third-form-block").show();
        $('.v2-form-loading-bar').hide();
      }, 200);
    }
    if(is_webinar_1o1_eligible){
      $("input:radio[name='start-date']:first").attr("checked", true);
      $(".wr__event-start-time").val($("input:radio[name='start-date']:first").val());
      $(".wr__event-end-time").val($("input:radio[name='start-date']:first").data("endtime"));
      $(".wr__invitee-start-time").val($("input:radio[name='start-date']:first").data("invitee_starttime"));
      $(".wr__invitee-end-time").val($("input:radio[name='start-date']:first").data("invitee_endtime"));
      $(".webinar-lead-type").val($("input:radio[name='start-date']:first").data("webinar_lead_type"));
    } else {
      $("input:radio[name='v2-slots-radio']:first").attr("checked", true);
      $('.wr__event-start-time').val($("input:radio[name='v2-slots-radio']:first").val());
      $('.wr__event-end-time').val($("input:radio[name='v2-slots-radio']:first").data('endtime'));
      $('.wr__invitee-start-time').val($("input:radio[name='v2-slots-radio']:first").data('invitee_starttime'));
      $('.wr__invitee-end-time').val($("input:radio[name='v2-slots-radio']:first").data('invitee_endtime'));
      $('.webinar-lead-type').val($("input:radio[name='v2-slots-radio']:first").data('webinar_lead_type'));
    }
    if (validationError) return;
    if (window.skipSecondSteps){
        let slotBookRes = {}
        if(is_webinar_1o1_eligible){
            slotBookRes = await bookSlot();
        }

        if ($("input:radio[name='v2-slots-radio']").is(":checked") || (is_webinar_1o1_eligible && $('input[name="start-date"]').is(":checked") )) {
        try { paRegisteredCookie(); } catch (e) { console.error(e) }

        let startDate = "";
        let endDate = "";

        if(is_webinar_1o1_eligible){
            const localDate = new Date(slotBookRes.start_datetime);

            const day = localDate.toLocaleString('en-US', { weekday: 'long' });
            const date = localDate.getDate();
            const month = localDate.toLocaleString('en-US', { month: 'long' });
            
            let hours = localDate.getHours() % 12 || 12;
            let minutes = localDate.getMinutes();
            let period = localDate.getHours() >= 12 ? 'pm' : 'am';
            let time = minutes === 0 ? `${hours}${period}` : `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
            
            SELECTED_SLOT['day'] = day;
            SELECTED_SLOT['date'] = date;
            SELECTED_SLOT['time'] = time;
            SELECTED_SLOT['month'] = month;

            startDate = $('input[name="start-date"]:checked').val();
            endDate = $('input[name="start-date"]:checked').data("endtime");
        } else {
            startDate = $('input[name="v2-slots-radio"]:checked').val();
            endDate = $('input[name="v2-slots-radio"]:checked').data("endtime");
        }

        function updateFormFields() {
            $(".wr__event-start-time").val(startDate);
            $(".wr__event-end-time").val(endDate);
            if(is_webinar_1o1_eligible){
            $(".wr__event-start-time").val($("input:radio[name='start-date']:first").val());
            $(".wr__event-end-time").val($("input:radio[name='start-date']:first").data("endtime"));
            $(".wr__invitee-start-time").val($("input:radio[name='start-date']:first").data("invitee_starttime"));
            $(".wr__invitee-end-time").val($("input:radio[name='start-date']:first").data("invitee_endtime"));
            $(".webinar-lead-type").val($("input:radio[name='start-date']:first").data("webinar_lead_type"));
            } else {
            $(".wr__invitee-start-time").val($('input[name="v2-slots-radio"]:checked').data("invitee_starttime"));
            $(".wr__invitee-end-time").val($('input[name="v2-slots-radio"]:checked').data("invitee_endtime"));
            $(".webinar-lead-type").val($('input[name="v2-slots-radio"]:checked').data("webinar_lead_type"));
            }
        }

        updateFormFields();
        if(is_webinar_1o1_eligible){
            pushToZap("https://hooks.zapier.com/hooks/catch/11068981/2dvpcc1/");
        }else if (typeof paRegistered !== "undefined") {
            $(".v2-form-loading-bar").show();
            pushToZap("https://hooks.zapier.com/hooks/catch/11068981/307qti9/");
        } else {
            $(".v2-form-loading-bar").show();
            pushToZap("https://hooks.zapier.com/hooks/catch/11068981/340hl1a/");
        }

        bake_cookie("v_history", "");
        bake_cookie("v_latest", "");

        $('#wf-webinar-2-step-v2').submit();

        // For A/B testing
        VWO.event("gqlFormCompleted", {
            "gqlFormCompleted": true
        });

        $(".v2-second-form-block").hide();
        adjustFormStep("#2-step-indicator", "#3-step-indicator");
        setTimeout(function () {
            $('.v2-form-loading-bar').hide();
            // $(".v2-third-form-block").show();
            GQLFormVisible();
        }, 200);

        }

        try { gqlFormCookieData(); } catch (e) { console.error(e) }

        // Lead Creation Time
        const currentDateTime = new Date();
        const leadCreatedTime = formatDate(currentDateTime);

        function submitLeadData(leadCreatedTime) {
        const defaultValue =  window.defaultSlotForShortPage;
        const StartDate = $(".wr__event-start-time").val() ? $(".wr__event-start-time").val() : defaultValue?.eventStartTime;
        const EndDate = $(".wr__event-end-time").val() ? $(".wr__event-end-time").val() : defaultValue?.eventEndTime;
        const formattedStartDateTime = formatDate(StartDate);
        const formattedEndDateTime = formatDate(EndDate);

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
                Event_Type_Name: window.eventNameForWebinarType,
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
                User_Agent: encodeURIComponent(navigator?.userAgent || ""),
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
    }

  })

  function bookSlot() {
    return new Promise(async (resolve, reject) => {
      if (is_webinar_1o1_eligible) {
        const url =
          "https://uplevel.interviewkickstart.com/api/v1/webinar_connect/book-slot/";
        const payload = {
          slot_id: parseInt(
            $('input[name="start-date"]:checked').data("slotid")
          ),
          email: $('#v2-email').val(),
        };
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          redirect: "follow",
        };

        const res = await fetch(url, requestOptions);
        const data = await res.json();
        if (res.status === 201) {
          $('input[name="start-date"]:checked').data(
            "bookingid",
            data.booking_id
          );
          resolve(data);
        } else {
          webinar1o1Fallback();
          console.error(
            "Something went wrong while calling webinar_connect/book-slot api",
            res,
            data
          );
          reject(
            new Error(
              "Something went wrong while calling webinar_connect/book-slot api"
            )
          );
        }
      } else {
        resolve();
      }
    });
  }
if (!window.skipSecondSteps){
  $('#v2-form-2nd-submit').click(async function (e) {
    e.preventDefault();
    let slotBookRes = {}
    if(is_webinar_1o1_eligible){
      slotBookRes = await bookSlot();
    }

    if ($("input:radio[name='v2-slots-radio']").is(":checked") || (is_webinar_1o1_eligible && $('input[name="start-date"]').is(":checked") )) {
      try { paRegisteredCookie(); } catch (e) { console.error(e) }

      let startDate = "";
      let endDate = "";

      if(is_webinar_1o1_eligible){
        const localDate = new Date(slotBookRes.start_datetime);

        const day = localDate.toLocaleString('en-US', { weekday: 'long' });
        const date = localDate.getDate();
        const month = localDate.toLocaleString('en-US', { month: 'long' });
        
        let hours = localDate.getHours() % 12 || 12;
        let minutes = localDate.getMinutes();
        let period = localDate.getHours() >= 12 ? 'pm' : 'am';
        let time = minutes === 0 ? `${hours}${period}` : `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
        
        SELECTED_SLOT['day'] = day;
        SELECTED_SLOT['date'] = date;
        SELECTED_SLOT['time'] = time;
        SELECTED_SLOT['month'] = month;

        startDate = $('input[name="start-date"]:checked').val();
        endDate = $('input[name="start-date"]:checked').data("endtime");
      } else {
        startDate = $('input[name="v2-slots-radio"]:checked').val();
        endDate = $('input[name="v2-slots-radio"]:checked').data("endtime");
      }

      function updateFormFields() {
        $(".wr__event-start-time").val(startDate);
        $(".wr__event-end-time").val(endDate);
        if(is_webinar_1o1_eligible){
          $(".wr__event-start-time").val($("input:radio[name='start-date']:first").val());
          $(".wr__event-end-time").val($("input:radio[name='start-date']:first").data("endtime"));
          $(".wr__invitee-start-time").val($("input:radio[name='start-date']:first").data("invitee_starttime"));
          $(".wr__invitee-end-time").val($("input:radio[name='start-date']:first").data("invitee_endtime"));
          $(".webinar-lead-type").val($("input:radio[name='start-date']:first").data("webinar_lead_type"));
        } else {
          $(".wr__invitee-start-time").val($('input[name="v2-slots-radio"]:checked').data("invitee_starttime"));
          $(".wr__invitee-end-time").val($('input[name="v2-slots-radio"]:checked').data("invitee_endtime"));
          $(".webinar-lead-type").val($('input[name="v2-slots-radio"]:checked').data("webinar_lead_type"));
        }
      }

      updateFormFields();
      if(is_webinar_1o1_eligible){
        pushToZap("https://hooks.zapier.com/hooks/catch/11068981/2dvpcc1/");
      }else if (typeof paRegistered !== "undefined") {
        $(".v2-form-loading-bar").show();
        pushToZap("https://hooks.zapier.com/hooks/catch/11068981/307qti9/");
      } else {
        $(".v2-form-loading-bar").show();
        pushToZap("https://hooks.zapier.com/hooks/catch/11068981/340hl1a/");
      }

      bake_cookie("v_history", "");
      bake_cookie("v_latest", "");

      $('#wf-webinar-2-step-v2').submit();

      // For A/B testing
      VWO.event("gqlFormCompleted", {
        "gqlFormCompleted": true
      });

      $(".v2-second-form-block").hide();
      adjustFormStep("#2-step-indicator", "#3-step-indicator");
      setTimeout(function () {
        $('.v2-form-loading-bar').hide();
        $(".v2-third-form-block").show();
        GQLFormVisible();
      }, 200);

    }

    try { gqlFormCookieData(); } catch (e) { console.error(e) }

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
            Event_Type_Name: window.eventNameForWebinarType,
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
            User_Agent: encodeURIComponent(navigator?.userAgent || ""),
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
  });}

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
      event_name: window.eventNameForWebinarType,
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
    let sf_uuid = v_timezone + ":learn.ik" +  cta_lp +  ":learn.ik" +  getCookie("ik-landingpage-v2");

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
      "salesforce_uuid": sf_uuid,
    }
    const eventStartTime = window?.defaultSlotForShortPage?.eventStartTime;
	const eventEndTime = window?.defaultSlotForShortPage?.eventEndTime;
	const inviteeStartTime =  window?.defaultSlotForShortPage?.inviteeStartTime;
	const inviteeEndTime = window?.defaultSlotForShortPage?.inviteeEndTime;
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
      eventStartTime: $(".wr__event-start-time").val() ? $(".wr__event-start-time").val() : eventStartTime,
      eventEndTime: $(".wr__event-end-time").val() ? $(".wr__event-end-time").val() : eventEndTime,
      inviteeStartTime: $(".wr__invitee-start-time").val() ? $(".wr__invitee-start-time").val() :inviteeStartTime,
      inviteeEndTime: $(".wr__invitee-end-time").val() ? $(".wr__invitee-end-time").val() : inviteeEndTime,
      learnUserId: $(".user_id").val(),
      event_name: window.eventNameForWebinarType,
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
              $("#v2-form-container").css("display", "none");
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