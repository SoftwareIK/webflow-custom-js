//https://interviewkickstart.albiorixtech.in/ep-webinar-india-v1.js

var no_of_webinar_slots = 6;
var interviewPrepURL, switchUpURL;

$(document).ready(function () {
  var int_phone3;
  let utmpams = getUTMParams();

  if (webinarType == "CAREER_SESSION") {
    if (utmpams['event_title'] != undefined) {
      $(".webinar__lightbox-title").text(decodeURIComponent(utmpams['event_title']));
      $('input[name="Event Name"]').val(decodeURIComponent(utmpams['event_title']));
      eventName = decodeURIComponent(utmpams['event']);
    } else {
      $(".webinar__lightbox-title").text("Seize the AI Advantage: Strengthen Your Resume");
      $('input[name="Event Name"]').val("Seize the AI Advantage: Strengthen Your Resume");
      eventName = "Seize the AI Advantage: Strengthen Your Resume";
    }
  } else if (webinarType == "SWITCH_UP") {
    if (utmpams['event_title'] != undefined) {
      $(".webinar__lightbox-title").text(decodeURIComponent(utmpams['event_title']));
      $('input[name="Event Name"]').val(decodeURIComponent(utmpams['event_title']));
      eventName = decodeURIComponent(utmpams['event']);
    } else {
      $(".webinar__lightbox-title").text("Future-proof your career with AI/ ML, Data Science");
      $('input[name="Event Name"]').val("Future-proof your career with AI/ ML, Data Science");
      eventName = "Future-proof your career with AI/ ML, Data Science";
    }
  } else {
    if (utmpams['event_title'] != undefined) {
      $(".webinar__lightbox-title").text(decodeURIComponent(utmpams['event_title']));
      $('input[name="Event Name"]').val(decodeURIComponent(utmpams['event_title']));
      eventName = decodeURIComponent(utmpams['event']);
    } else {
      $(".webinar__lightbox-title").text("How to Nail your next Technical Interview");
      $('input[name="Event Name"]').val("How to Nail your next Technical Interview");
      eventName = "How to Nail your next Technical Interview";
    }
  }
  $('.webinar-lightbox-close').click(function (e) {
    $('.webinar__lightbox').css('display', 'none');
    $('body').css('overflow', 'auto');
  });

  if (isSwitchUp == "No") {
    let api_url = "https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=IND&program=Backend&timezone=" + v_timezone + "&type=" + webinarType;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', api_url, true);
    xhr.setRequestHeader("Authorization", "1Cgx6oYXkOlWkNDn7_tXO");
    //var tz = new Date().toString().match(/\((.+)\)/);
    /*  if (tz[1].includes(" ")) {
        tz = tz[1]
          .split(" ")
          .map(([first]) => first)
          .join("");
      }*/

    xhr.onload = function () {
      if (this.status == 200) {
        let resobj = JSON.parse(this.response);
        if (webinarType == "REGULAR") {
          resobj = resobj.map(item => ({ ...item, webinar_lead_type: "REGULAR" }));
        }
        // else {
        //   resobj = resobj.map(item => ({ ...item, webinar_lead_type: "SWITCH_UP" }));
        // }
        TimerHandler(resobj);
        populateWebinarSlots(resobj);
      } else {
        TimerHandler(null);
        console.error("P0: The Uplevel Webinar Slots API Failed.");
        registration_type = "calendly";
      }
    }
    xhr.onerror = function () {
      TimerHandler(null);
      console.error("P0: The Uplevel Webinar Slots API Failed.");
      registration_type = "calendly";
    }
    xhr.send();
  } else {
    interviewPrepURL = 'https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=IND&program=Backend&timezone=' + v_timezone + '&type=REGULAR';
    // switchUpURL = 'https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=IND&program=Backend&timezone=' + v_timezone + '&type=SWITCH_UP';
    combineResponses().then((data) => {
      populateWebinarSlots(data);
      TimerHandler(data);
    }).catch(() => {
      TimerHandler(null);
    });
  }
});

if (document.querySelector("#webinar_pnumber") != null) {
  int_phone3 = window.intlTelInput(document.querySelector("#webinar_pnumber"), {
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
}
$('.btn-back-to-step1').click(function (e) {
  $('.webinar__registration-form1').show();
  $('.webinar__registration-success').hide();
  $('.webinar__registration-form1-block').show();
  $('.webinar__registration-form2-block').hide();
});

function populateWebinarSlots(resobj) {
  const t_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let utmparams = getUTMParams();

  if ((utmparams['startdate'] != undefined) && (utmparams['enddate'] != undefined)) {
    let newresobj = getItemsByDateRange(utmparams['startdate'], utmparams['enddate'], resobj);
    resobj = (newresobj.length == 0) ? resobj : newresobj;
  }

  if (resobj.length == 0) {
    console.error("P0: The Uplevel Webinar Slots API Returned No Data.");
    registration_type = "calendly";
  } else {
    registration_type = "byecalendly";
  }

  no_of_webinar_slots = (no_of_webinar_slots == undefined) ? 4 : no_of_webinar_slots;
  let nslots = (resobj.length > no_of_webinar_slots) ? no_of_webinar_slots : resobj.length;
  var tz = new Date().toString().match(/\((.+)\)/);
  if (tz[1].includes(" ")) {
    tz = tz[1]
      .split(" ")
      .map(([first]) => first)
      .join("");
  }
  for (i = 0; i < nslots; i++) {
    var hdate = resobj[i].weekday + ", " + resobj[i].day + " " + t_months[parseInt(resobj[i].month) - 1] + " " + resobj[i].year + " | " + resobj[i].hour + ":" + resobj[i].minute + " " + resobj[i].am_or_pm;
    var radiohtml = '<label class="select-webinar-slot w-radio"><input type="radio" name="start-date" value="' + resobj[i].start_time + '" data-endtime="' + resobj[i].end_time + '" data-invitee_starttime="' + resobj[i].invitee_start_time + '" data-invitee_endtime="' + resobj[i].invitee_end_time + '" data-name="' + resobj[i].start_time + '" data-webinar_lead_type="' + resobj[i].webinar_lead_type + '" class="w-form-formradioinput select-webinar-radio-btn w-radio-input"><span class="w-form-label" for="start-date-' + i + '">' + hdate + ' ' + tz + '</span></label>';
    $('.webinar__slots').append(
      $(radiohtml)
    );
  }
}

function getItemsByDateRange(startDate, endDate, data) {
  var startDate = new Date(startDate);
  var endDate = new Date(endDate);

  return $.grep(data, function (item) {
    var itemDate = new Date(item.start_time);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

// Function to fetch data from an API
async function fetchData(url) {
  const response = await fetch(url, {
    headers: {
      "Authorization": "1Cgx6oYXkOlWkNDn7_tXO"
    }
  });
  const data = await response.json();
  return data;
}

// Function to combine the responses into one JSON array
async function combineResponses() {
  try {
    let interviewPrepData = await fetchData(interviewPrepURL);
    // let switchUpData = await fetchData(switchUpURL);

    // Add new property to each object in the arrays
    interviewPrepData = interviewPrepData.map(item => ({ ...item, webinar_lead_type: "REGULAR" }));
    // switchUpData = switchUpData.map(item => ({ ...item, webinar_lead_type: "SWITCH_UP" }));

    // Filter out the entries from interviewPrepData if switchUpData has a value on the same day
    const combinedData = [...interviewPrepData];

    for (const switchUpEntry of switchUpData) {
      const sameDayEntryIndex = combinedData.findIndex((entry) => entry.day === switchUpEntry.day);
      if (sameDayEntryIndex !== -1) {
        combinedData.splice(sameDayEntryIndex, 1);
      }
      combinedData.push(switchUpEntry);
    }
    // Sort the combinedData array by start_time
    combinedData.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    return combinedData;
  } catch (error) {
    console.error('Error:', error);
  }
}

function pushToEndPoint(endpoint) {
  //Zap end point for step 1
  var formData = {
    "First Name": $(".wr__firstname").val(),
    "Last Name": $(".wr__lastname").val(),
    "Email Address": $(".email").val(),
    "ByeCalendlyType": $(".bye-calendly-type").val(),
    "webinar-type": $(".webinar-type").val(),
    "Webinar Lead Type": $(".webinar-lead-type").val(),
    "utm_source": $(".utm_source").val(),
    "utm_medium": $(".utm_medium").val(),
    "utm_campaign": $(".utm_campaign").val(),
    "utm_content": $(".utm_content").val(),
    "utm_adset": $(".utm_adset").val(),
    "utm_term": $(".utm_term").val(),

    "City": $(".wr__city").val(),
    "Device": $(".wr__device").val(),
    "Referrer": $(".wr__referrer").val(),
    "Region": $(".wr__region").val(),

    "gclid": $(".gclid").val(),
    "msclkid": $(".msclkid").val(),
    "fbclid": $(".fbclid").val(),
    "user_id": $(".user_id").val(),

    "cta_page_url": $(".cta_page_url").val(),
    "landing_page_url": $(".l_page_url").val(),
    "event_name": eventName,
    "user_timezone": $(".user_timezone").val(),
    "page_url": $(".page_url").val(),
    "site_url": $(".site_url").val(),
    "v_country": $(".v_country").val(),
    "salesforce_uuid": $(".salesforce_uuid").val(),
    "phone_number_full": $(".tno1").val(),
    "is_exit_intent_popup": $(".is_exit_intent_popup").val(),

    "Event Start Time": $(".wr__event-start-time").val(),
    "Event End Time": $(".wr__event-end-time").val(),
    "Invitee Start Time": $(".wr__invitee-start-time").val(),
    "Invitee End Time": $(".wr__invitee-end-time").val(),
  };

  $.ajax({
    type: "POST",
    url: endpoint,
    data: formData,
    success: function (e) {
      if (e.status == "success") {
        console.log("Form submitted successfully!");
      } else {
        console.error("P0: The Zapier Webhook Failed.");
      }
    }
  });
}

$('.bc__btn-select-webinar-slot').click(function (e) {
  e.preventDefault();
  setHiddenFields();

  let fullphonenumber3 = int_phone3.getNumber(intlTelInputUtils.numberFormat.E164);
  $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
  $(".tno1").val(fullphonenumber3);

  $(".full-name, .phone, .email").keypress(function () {
    $('.full-name-error,.email-id-error,.phone-error').addClass('hide');
  });

  $(".full-name, .phone, .email").focus(function () {
    $('.full-name-error, .email-id-error,.phone-error').addClass('hide');
  });

  //let active_visit = read_cookie("v_latest");
  let name_regex = new RegExp("^[a-zA-Z ]+$");
  let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

  if (($(".full-name").val().length == 0) &&
    ($(".email").val().length == 0) &&
    ($(".phone").val().length == 0)) {
    //$('.full-name, .email, .phone').addClass('input-error');
    $('.full-name-error,.email-id-error,.phone-error').removeClass('hide');
  }
  else if (!name_regex.test($(".full-name").val()) || $(".full-name").val().length == 0) {
    $('.full-name-error').removeClass('hide');
  } else if (!phone_regex.test($(".phone").val()) || $(".phone").val().length == 0) {
    $('.phone-error').removeClass('hide');
  } else if (!email_regex.test($(".email").val()) || $(".email").val().length == 0) {
    $('.email-id-error').removeClass('hide');
  } else {
    $('.webinar__loadingbar').css("display", "flex");

    let fullname = $(".full-name").val();

    if (fullname.substring(0, fullname.indexOf(' ')) == '') {
      $('.wr__firstname').val(fullname.substring(fullname.indexOf(' ') + 1));
      $('.wr__lastname').val(fullname.substring(fullname.indexOf(' ') + 1));
    } else if (fullname.substring(fullname.indexOf(' ') + 1) == '') {
      $('.wr__firstname').val(fullname.substring(0, fullname.indexOf(' ')));
      $('.wr__lastname').val(fullname.substring(0, fullname.indexOf(' ')));
    } else {
      $('.wr__firstname').val(fullname.substring(0, fullname.indexOf(' ')));
      $('.wr__lastname').val(fullname.substring(fullname.indexOf(' ') + 1));
    }

    $('.wr__email').val($(".email").val());
    $('.wr__phone').val(fullphonenumber3);
    dataLayer.push({
      'event': 'new_webinar_registration_form_submitted',
      'webinar_name': (document.querySelector('.webinar__lightbox-title').innerHTML)
    });

    pushToEndPoint("https://hooks.zapier.com/hooks/catch/11068981/34xpbjl/");
    $('.webinar__registration-form1').submit();
    $('.webinar__registration-form1-block').hide();

    setTimeout(function () {
      $('.webinar__registration-form2-block').show();
      $('.webinar__loadingbar').hide();
    }, 200);

  }
  $("input:radio[name='start-date']:first").attr("checked", true);
  $('.wr__event-start-time').val($("input:radio[name='start-date']:first").val());
  $('.wr__event-end-time').val($("input:radio[name='start-date']:first").data('endtime'));
  $('.wr__invitee-start-time').val($("input:radio[name='start-date']:first").data('invitee_starttime'));
  $('.wr__invitee-end-time').val($("input:radio[name='start-date']:first").data('invitee_endtime'));
  $('.webinar-lead-type').val($("input[name='start-date']:checked").data('webinar_lead_type'));
  $('.wr__whatsappconsent').val($('.whatsapp-consent').is(":checked"));

});

$('.bc__btn-2nd-step').click(function (e) {
  e.preventDefault();
  setHiddenFields();
  if ($("input:radio[name='start-date']").is(":checked")) {
    let estarttime = $('input[name="start-date"]:checked').val();
    let eendtime = $('input[name="start-date"]:checked').data('endtime');
    let utmm = visitor_id + ":" + v_country;
    let sf_uuid = v_timezone + ":in.ik" + cta_lp + ":in.ik" + getCookie("ik-landingpage");
    let utmstring = "?assigned_to=Interview Kickstart&invitee_first_name=" + $('.wr__firstname').val() + "&invitee_last_name=" + $('.wr__lastname').val() + "&invitee_email=" + $('.wr__email').val() + "&answer_1=" + $('.wr__phone').val() + "&event_start_time=" + estarttime + "&event_end_time=" + eendtime + "&utm_medium=" + utmm + "&salesforce_uuid=" + sf_uuid + "&whatsapp_consent=" + $('.wr__whatsappconsent').val();
    let finalurl = "/signup-final-step" + utmstring;
    $('.wr__event-start-time').val(estarttime);
    $('.wr__event-end-time').val(eendtime);
    $('.wr__invitee-start-time').val($("input[name='start-date']:checked").data('invitee_starttime'));
    $('.wr__invitee-end-time').val($("input[name='start-date']:checked").data('invitee_endtime'));
    $('.webinar-lead-type').val($("input[name='start-date']:checked").data('webinar_lead_type'));
    $('.webinar__loadingbar').show();

    pushToEndPoint("https://hooks.zapier.com/hooks/catch/11068981/34xpujj/");
    $('.webinar__registration-form2').submit();

    setTimeout(function () {
      location.href = finalurl;
    }, 400);

    let formData = {
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
      event_name: $("input[name='Event Name']").val(),
      user_id: $(".user_timezone").val(),
      cta_url: $(".cta_page_url").val(),
      landing_page_url: $(".l_page_url").val(),
    };
    //lead LeadCreatedTime
    const currentDateTime = new Date();
    const LeadCreatedTime = currentDateTime.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, ' UTC');
    //convert UTC time format
    function formatDateTime(dateTimeString) {
      const date = new Date(dateTimeString);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
    }
    const formattedStartDateTime = formatDateTime($(".wr__event-start-time").val());
    const formattedEndDateTime = formatDateTime($(".wr__event-end-time").val());
    let data = [{
      "Lead_Created_Time": LeadCreatedTime,
      "Lead_Name": formData.firstName + ' ' + formData.lastName,
      "Lead_First_Name": formData.firstName,
      "Lead_Last__Name": formData.lastName,
      "Lead_Email": formData.email,
      "Lead_Time_Zone": $(".user_timezone").val(),
      "Event_Type_Name": $('input[name="Event Name"]').val(),
      "Event_Start_Date_Time": formattedStartDateTime,
      "Event_End_Date_Time": formattedEndDateTime,
      "Cancellation_reason": "",
      "Mobile": $('.wr__phone').val(),
      "UTM_Campaign": $(".utm_campaign").val(),
      "UTM_Source": $(".utm_source").val(),
      "UTM_Medium": $(".utm_medium").val(),
      "UTM_Term": $(".utm_term").val(),
      "UTM_Content": $(".utm_content").val(),
      "Tracking_ID": "",
      "User_ID": $('.user_id').val(),
      "Page_URL": encodeURIComponent($('.page_url').val()),
      "Country": $(".v_country").val(),
      "Client_Timezone": $(".user_timezone").val(),
      "CTA_Page": encodeURIComponent($(".cta_page_url").val()),
      "Landing_Page": encodeURIComponent(formData.landing_page_url),
      "Webinar_reg_type": $(".bye-calendly-type").val(),
      "Webinar_Type": $(".webinar-type").val(),
      "Switchup_Lead": $(".webinar-lead-type").val(),
      "UUID": $(".salesforce_uuid").val(),
      "Click_History": "",
      "City": $(".wr__city").val(),
      "Device": $(".wr__device").val(),
      "Refferer": encodeURIComponent($(".wr__referrer").val()),
      "Region": $(".wr__region").val()
    }];

    $.ajax({
      url: 'https://nlhtyrnugl.execute-api.us-west-1.amazonaws.com/prod',
      method: 'POST',
      headers: {
        'x-api-key': 'fm0X61U99b80d5SlGjrxFaWjgxIBylhX3LkfYGPN',
        'Content-Type': 'application/json',
      },

      data: JSON.stringify({
        dataset_id: "Marketing_data_new_logic",
        table_id: "Leads_Click_history",
        data: data,
      }),
      success: function (e) {
        console.log("Success Response:", e);
        console.log("Success Response:", data);
      },
      error: function (xhr, status, error) {
        console.log("Error Response:", xhr.responseText);
        console.log("Status:", status);
        console.log("Error:", error);
      }
    });
  }
});

const currentDateTime = new Date();
const LeadCreatedTime = currentDateTime.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, ' UTC');

//const LeadCreatedTime = new Date().toISOString().replace('T', ' ').slice(0, -5) + ' UTC';
const now = new Date();
const year = now.getUTCFullYear();
const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
const day = now.getUTCDate().toString().padStart(2, '0');
const hours = now.getUTCHours().toString().padStart(2, '0');
const minutes = now.getUTCMinutes().toString().padStart(2, '0');
const seconds = now.getUTCSeconds().toString().padStart(2, '0');
const milliseconds = now.getUTCMilliseconds();
var newDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} UTC`;
setTimeout(() => {
  let data1 = [{
    "Lead_Created_Time": currentDateTime,
    "Lead_Time_Zone": encodeURIComponent($(".user_timezone").val()),
    "Event_Type_Name": encodeURIComponent($('input[name="Event Name"]').val()),
    "Cancellation_reason": "",
    "UTM_Campaign": encodeURIComponent($(".utm_campaign").val()),
    "UTM_Source": encodeURIComponent($(".utm_source").val()),
    "UTM_Medium": encodeURIComponent($(".utm_medium").val()),
    "UTM_Term": encodeURIComponent($(".utm_term").val()),
    "UTM_Content": encodeURIComponent($(".utm_content").val()),
    "Tracking_ID": "",
    "User_ID": encodeURIComponent($(".user_id").val()),
    "Page_URL": encodeURIComponent($(".page_url").val()),
    "Country": encodeURIComponent($(".v_country").val()),
    "Client_Timezone": encodeURIComponent($(".user_timezone").val()),
    "CTA_Page": encodeURIComponent($(".cta_page_url").val()),
    "Landing_Page": encodeURIComponent($(".l_page_url").val()),
    "Click_History": "",
    "City": encodeURIComponent($(".wr__city").val()),
    "Device": encodeURIComponent($(".wr__device").val()),
    "Refferer": encodeURIComponent($(".wr__referrer").val()),
    "Region": encodeURIComponent($(".wr__region").val()),
    "New_Lead_Created_Time": encodeURIComponent(newDate),
  }];
  $.ajax({
    url: 'https://nlhtyrnugl.execute-api.us-west-1.amazonaws.com/prod',
    method: 'POST',
    headers: {
      'x-api-key': 'fm0X61U99b80d5SlGjrxFaWjgxIBylhX3LkfYGPN',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      dataset_id: "Marketing_data_new_logic",
      table_id: "Leads_Click_history",
      data: data1,
    }),
    success: function (e) {
      console.log("Success Response:", e);
      console.log("Click_history-data:", data1);
    },
    error: function (xhr, status, error) {
      console.log("Error Response:", xhr.responseText);
      console.log("Status:", status);
      console.log("Error:", error);
    }
  });
}, "3000");