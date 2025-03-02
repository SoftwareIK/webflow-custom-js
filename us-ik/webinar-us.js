//https://interviewkickstart.albiorixtech.in/ep-webinar-us-site.v2.0.js
var experiment_type,
  exitintent_freecourse,
  v_timezone_formatted,
  interviewPrepURL,
  switchUpURL,
  hybrid,
  is_webinar_1o1_eligible = false;

function isDev() {
  return location?.host?.includes("webflow");
}

function getLearnGQLLink() {
  const host = isDev()
    ? "https://ikdev.webflow.io"
    : "https://www.interviewkickstart.com";
  if (webinarType == "SWITCH_UP") {
    return `${host}/signup-final-step-switchup-v6`;
  }
  return `${host}/signup-final-step-v6`;
}

$(document).ready(function () {
  var int_phone3;
  $(".webinar-lightbox-close").click(function (e) {
    if (experiment_type == "ExitIntent") {
      $(".webinar__lightbox-card").css("display", "none");
      $(".webinar__lightbox-exit-intent").css("display", "block");
    } else if (exitintent_freecourse == true) {
      $(".webinar__lightbox-card").css("display", "none");
      $(".webinar__lightbox-free-course").css("display", "block");
      $(".exitintent-fc-email").val($(".email").val());

      dataLayer.push({
        event: "exit_intent",
        eventCategory: "exit_intent_free_course",
        eventAction: "exit_intent_free_course",
        eventLabel: "form triggered",
      });
    } else {
      $(".webinar__lightbox").css("display", "none");
      $("body").css("overflow", "auto");

      if ($(".is_exit_intent_popup").val() == "On Scroll") {
        dataLayer.push({
          event: "exit_intent",
          eventCategory: "exit_intent_scroll",
          eventAction: "exit_intent_scroll",
          eventLabel: "close",
        });
      }

      if ($(".is_exit_intent_popup").val() == "Browser Tab") {
        dataLayer.push({
          event: "exit_intent",
          eventCategory: "exit_intent_browser_tab_close_gesture",
          eventAction: "exit_intent_browser_tab_close_gesture",
          eventLabel: "close",
        });
      }
    }
  });

  const browserDetails = getBrowserDetails();
  const inputData = {
      ipAddress: null,
      browserName: browserDetails.name,
      browserVersion: browserDetails.version,
  };

  async function fetchIPAddress() {
      const apiURL = 'https://api.ipify.org?format=json';
      try {
          const response = await fetch(apiURL);

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          inputData.ipAddress = data.ip;
          return data.ip;

      } catch (error) {
          console.error('Error fetching IP address:', error);
          return null;
      }
  }

  function addHiddenForm() {
      const form = document.createElement('form');
      form.style.display = 'none'; // Ensure the form is hidden

      // Create and append hidden fields
      const fields = {
          ipAddress: inputData.ipAddress,
          browserName: inputData.browserName,
          browserVersion: inputData.browserVersion,
      };

      for (const [key, value] of Object.entries(fields)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value || '';
          input.id = `${key}-input`;
          form.appendChild(input);
      }

      document.body.appendChild(form);
  }

  // Main logic
  (async () => {
      const ipAddress = await fetchIPAddress();
      if (ipAddress) {
          console.log('Your IP address is:', ipAddress);
      } else {
          console.log('Failed to fetch the IP address.');
      }
      addHiddenForm();
  })();
  function getBrowserDetails() {
      const ua = navigator.userAgent;
      let browserName = "Unknown";
      let version = "Unknown";

      if (ua.indexOf("Firefox") > -1) {
          browserName = "Firefox";
          version = ua.split("Firefox/")[1];
      } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg/") === -1) {
          browserName = "Chrome";
          version = ua.split("Chrome/")[1].split(" ")[0];
      } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
          browserName = "Safari";
          version = ua.split("Version/")[1].split(" ")[0];
      } else if (ua.indexOf("Edg/") > -1) {
          browserName = "Edge";
          version = ua.split("Edg/")[1];
      } else if (ua.indexOf("Trident/") > -1) {
          browserName = "Internet Explorer";
          version = ua.split("rv:")[1].split(")")[0];
      }

      return { name: browserName, version: version };
  }


  function daysUntil(dateString) {
    const futureDate = new Date(dateString);
    const currentDate = new Date();
    const diffInMilliseconds = futureDate - currentDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    return diffInDays;
  }

  $(".btn-getaccess").click(function (e) {
    e.preventDefault();
    let email_regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    $(".exitintent-fc-email").keypress(function () {
      $(".exitintent-fc-email-error").addClass("hide");
    });

    $(".exitintent-fc-email").focus(function () {
      $(".exitintent-fc-email-error").addClass("hide");
    });

    if (
      !email_regex.test($(".exitintent-fc-email").val()) ||
      $(".exitintent-fc-email").val().length == 0
    ) {
      $(".exitintent-fc-email-error").removeClass("hide");
    } else {
      $(".exit-intent-free-course-form").submit();
      dataLayer.push({
        event: "exit_intent",
        eventCategory: "exit_intent_free_course",
        eventAction: "exit_intent_free_course",
        eventLabel: "form submitted",
      });
      $(".webinar-lightbox-exitintent-freecourse-close").hide();
      setTimeout(function () {
        $(".webinar__lightbox").css("display", "none");
        $(".webinar__lightbox-free-course").css("display", "none");
        $(".webinar__lightbox-card").css("display", "flex");
        $("body").css("overflow", "auto");
        $(".exit-intent-free-course-form").css("display", "block");
        $(".success-message-9").css("display", "none");
        $(".webinar-lightbox-exitintent-freecourse-close").show();
      }, 2000);
    }
  });

  $(".webinar-lightbox-exitintent-freecourse-close").click(function (e) {
    $(".webinar__lightbox").css("display", "none");
    $(".webinar__lightbox-free-course").css("display", "none");
    $(".webinar__lightbox-card").css("display", "flex");
    $("body").css("overflow", "auto");
    dataLayer.push({
      event: "exit_intent",
      eventCategory: "exit_intent_free_course",
      eventAction: "exit_intent_free_course",
      eventLabel: "close",
    });
  });

  $(".bc-popup-cta1").click(function (e) {
    $(".webinar__lightbox-card").css("display", "flex");
    $(".webinar__lightbox-exit-intent").css("display", "none");
  });

  $(".bc-popup-cta2").click(function (e) {
    $(".webinar__lightbox-card").css("display", "flex");
    $(".webinar__lightbox-exit-intent").css("display", "none");
    $(".webinar__lightbox").css("display", "none");
    $("body").css("overflow", "auto");
  });

  $.getJSON("https://get.geojs.io/v1/ip/geo.json", function (t) { })
    .done(function (t) {
      let local_timezone = v_timezone;
      if(typeof(v_timezone) != "undefined") {
        local_timezone = v_timezone;
      } else {
        local_timezone = "America/New_York"
      }

      let forceUSwebinarFlag = getAllUrlParams();
      if (
        t.country_code3 == "IND" &&
        forceUSwebinarFlag["forceuswebinar"] == undefined
      ) {
        createWebinarSlotsList("IND", t.timezone, (slots) => {
          TimerHandler("Asia/Kolkata", slots);
          // This fillWebinarSlots is for v2-pages.
          if (typeof fillWebinarSlots === "function") {
            fillWebinarSlots(slots);
          }
        });
      } else if (forceUSwebinarFlag["forceuswebinar"] == "true") {
        createWebinarSlotsList("USA", "US/Pacific", (slots) => {
          TimerHandler("America/New_York", slots);
          if (typeof fillWebinarSlots === "function") {
            fillWebinarSlots(slots);
          }
        });
      } else {
        createWebinarSlotsList("USA", t.timezone, (slots) => {
          TimerHandler(local_timezone, slots);
          if (typeof fillWebinarSlots === "function") {
            fillWebinarSlots(slots);
          }
        });
      }
    })
    .fail(function (t) {
      createWebinarSlotsList("USA", "US/Pacific", (slots) => {
        TimerHandler("America/New_York", slots);
        if (typeof fillWebinarSlots === "function") {
          fillWebinarSlots(slots);
        }
      });
    });

  is_webinar_1o1_eligible = webinarType === "ONE_TO_ONE_CONNECT";

  function getItemsByDateRange(startDate, endDate, data) {
    var startDate = new Date(startDate);
    var endDate = new Date(endDate);

    return $.grep(data, function (item) {
      var itemDate = new Date(item.utc_start_time);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  function populate1o1WebinarSlots(slotsDates, failedCallback) {
    if (!slotsDates || Object.keys(slotsDates).length === 0) {
      $(".webinar__slots").html("<p>No slots available</p>");
      failedCallback();
      return;
    }
    registration_type = "byecalendly";
    render1o1Slots(slotsDates);
    if (typeof fillWebinarSlots === "function") {
      fillWebinarSlots(null);
    }
  }

  function populateWebinarSlots(resobj) {
    const t_months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let forceUSwebinarFlag = getAllUrlParams();

    if (
      forceUSwebinarFlag["startdate"] != undefined &&
      forceUSwebinarFlag["enddate"] != undefined
    ) {
      let newresobj = getItemsByDateRange(
        forceUSwebinarFlag["startdate"],
        forceUSwebinarFlag["enddate"],
        resobj
      );
      resobj = newresobj.length == 0 ? resobj : newresobj;
    }

    if (resobj.length == 0) {
      registration_type = "calendly";
    } else {
      registration_type = "byecalendly";
    }
    let noslots = resobj.length > 6 ? 6 : resobj.length;
    $(".webinar__slots").empty();
    for (i = 0; i < noslots; i++) {
      var available_slots =
        ((Number(resobj[i].day) * 10007) % 50) +
        ((daysUntil(resobj[i].start_time) * 10007) % 50) * 3;
      let slotstr = resobj[i].invitee_end_time.substring(0, 7);
      let positionToInsert = slotstr.length - 2;
      let newSlotStr = [
        slotstr.slice(0, positionToInsert),
        " ",
        slotstr.slice(positionToInsert),
      ].join("");

      var hdate =
        resobj[i].weekday +
        ", " +
        resobj[i].day +
        " " +
        t_months[parseInt(resobj[i].month) - 1] +
        " " +
        resobj[i].year +
        " | " +
        resobj[i].hour +
        ":" +
        resobj[i].minute +
        " " +
        resobj[i].am_or_pm;
      var radiohtml =
        '<label class="select-webinar-slot w-radio"><input type="radio" name="start-date" value="' +
        resobj[i].start_time +
        '" data-endtime="' +
        resobj[i].end_time +
        '" data-invitee_starttime="' +
        resobj[i].invitee_start_time +
        '" data-invitee_endtime="' +
        resobj[i].invitee_end_time +
        '" data-name="' +
        resobj[i].start_time +
        '" class="w-form-formradioinput select-webinar-radio-btn w-radio-input" data-webinar_lead_type="' +
        resobj[i].webinar_lead_type +
        '"><span class="w-form-label" for="start-date-' +
        i +
        '">' +
        hdate +
        "</span></label>";
      var radiohtmlv2 =
        '<div class="ws-card"><div class="ws-card__day">' +
        resobj[i].weekday.substring(0, 3) +
        '</div><div class="slot-status-grid"><div class="ws-card__date">' +
        resobj[i].day +
        '</div><div class="ws-almost-full">Almost full!</div></div><div class="form-slot-block"><label class="form-radio-btn-block-slot w-radio"><div class="w-form-formradioinput w-form-formradioinput--inputType-custom ws-card__time-card w-radio-input"></div><input style="opacity:0;position:absolute;z-index:-1" type="radio" name="start-date" value="' +
        resobj[i].start_time +
        '" data-endtime="' +
        resobj[i].end_time +
        '" data-invitee_starttime="' +
        resobj[i].invitee_start_time +
        '" data-invitee_endtime="' +
        resobj[i].invitee_end_time +
        '" data-name="' +
        resobj[i].start_time +
        '" data-webinar_lead_type="' +
        resobj[i].webinar_lead_type +
        '"><span class="slod-text-hide w-form-label" for="radio-10">' +
        resobj[i].invitee_start_time.substring(0, 7) +
        "-" +
        resobj[i].invitee_end_time.substring(0, 7) +
        '</span></label><div class="slot-time-block"><div class="ws-time">' +
        resobj[i].invitee_start_time.substring(0, 5) +
        " - " +
        newSlotStr +
        '</div><div class="slot-available-grid"><div>Available Slots -</div><div class="ws-available-slots red">' +
        available_slots +
        "</div></div></div></div></div>";

      if (webinarUI == "v2") {
        $(".webinar__slots").append($(radiohtmlv2));
        $(".webinar__slots").addClass("slot-grid");
        $(".ws-available-slots").css("color", "#0E9F1C");
        $(".ws-card:first-child")
          .find(".ws-available-slots")
          .css("color", "#D14040");
        $(".ws-card:nth-child(2)")
          .find(".ws-available-slots")
          .css("color", "#ED7735");

        $(".ws-card").find(".ws-almost-full").hide();
        $(".ws-card:first-child").find(".ws-almost-full").show();
        $(".ws-card:nth-child(2)")
          .find(".ws-almost-full")
          .text("Filling fast!")
          .addClass("ws-filling-fast");
        $(".ws-filling-fast").css("display", "block");
      } else {
        $(".webinar__slots").append($(radiohtml));
      }
    }
  }

  function webinar1o1Fallback() {
    is_webinar_1o1_eligible = false;
    webinarType = "REGULAR";
    $(".webinar-lead-type").val("REGULAR");
    $(".webinar-type").val("REGULAR");
  }

  function callAPI(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", "1Cgx6oYXkOlWkNDn7_tXO");
  
    xhr.onload = function () {
      if (this.status === 200) {
        let response = JSON.parse(this.response);
        let webinarType = "REGULAR";
  
        if (webinarType === "REGULAR") {
          response = response.map((slot) => ({
            ...slot,
            webinar_lead_type: "REGULAR",
          }));
        }
  
        populateWebinarSlots(response);
      }
    };
    xhr.onerror = function (e) {
      console.error("Error fetching webinar slots",e);
    }
    xhr.send();
  }
  
  const fallbackSlots = () => {
    let webinarType = "REGULAR";
    const url = `https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/`;
    const timezone = "America/New_York";
  
    callAPI(`${url}?country=USA&program=Backend&timezone=${timezone}&type=${webinarType}`);
  };

  function createWebinarSlotsList(country, timezone, callback = () => { }) {
    $(".webinar-type").val(webinarType);

    v_timezone_formatted = timezone.replace("+", "%2B");

    switch (webinarType) {
      case undefined:
      case "REGULAR":
        webinarType = "REGULAR";
        break;
      case "ONE_TO_ONE_CONNECT":
        webinarType = "ONE_TO_ONE_CONNECT";
        break;
      default:
        webinarType = "SWITCH_UP";
        break;
    }

    if (typeof isSwitchUpHomePage !== "undefined" && isSwitchUpHomePage) {
      var getUtmParam = getAllUrlParams();
      if (
        v_timezone_formatted == "Asia/Kolkata" &&
        !getUtmParam.forceuswebinar &&
        !is_webinar_1o1_eligible
      ) {
        webinarType = "REGULAR";
      }
    }
    if (isSwitchUp == "No") {
      let api_url = is_webinar_1o1_eligible
        ? "https://uplevel.interviewkickstart.com/api/v1/webinar_connect/available-slots/"
        : "https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=" +
        country +
        "&program=Backend&timezone=" +
        v_timezone_formatted +
        "&type=" +
        webinarType;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", api_url, true);
      if (is_webinar_1o1_eligible === false)
        xhr.setRequestHeader("Authorization", "1Cgx6oYXkOlWkNDn7_tXO");
      var tz = new Date().toString().match(/\((.+)\)/);
      if (tz[1].includes(" ")) {
        tz = tz[1]
          .split(" ")
          .map(([first]) => first)
          .join("");
      }
      xhr.onload = function () {
        if (this.status == 200) {
          let resobj = JSON.parse(this.response);
          switch (webinarType) {
            case "SWITCH_UP":
              resobj = resobj.map((item) => ({
                ...item,
                webinar_lead_type: "SWITCH_UP",
              }));
              break;
            case "ONE_TO_ONE_CONNECT":
              break;
            default:
              resobj = resobj.map((item) => ({
                ...item,
                webinar_lead_type: "REGULAR",
              }));
              break;
          }
          callback(Array.isArray(resobj) ? resobj : []);
          if (is_webinar_1o1_eligible) {
            populate1o1WebinarSlots(resobj, () => {
              webinar1o1Fallback();
              createWebinarSlotsList(country, timezone, callback);
              xhr.abort();
            });
          } else {
            populateWebinarSlots(resobj);
          }
        } else {
          fallbackSlots();
          callback(null);
          registration_type = "calendly";
        }
      };
      xhr.onerror = function () {
        callback(null);
        fallbackSlots();
        registration_type = "calendly";
      };
      xhr.send();
    } else {
      interviewPrepURL =
        "https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=" +
        country +
        "&program=Backend&timezone=" +
        v_timezone_formatted +
        "&type=REGULAR";
      switchUpURL =
        "https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=" +
        country +
        "&program=Backend&timezone=" +
        v_timezone_formatted +
        "&type=SWITCH_UP";
      combineResponses()
        .then((data) => {
          populateWebinarSlots(data);
          callback(data);
        })
        .catch(() => {
          fallbackSlots();
          callback(null);
        });
    }
  }

  $("#ip-tab, #switchup-tab").click(function (e) {
    e.preventDefault();
    saveClickActivity("homepage_" + $(this).attr("id"), new Date().getTime());
    var queryParams = window.location.search;
    var destinationURL = $(this).attr("href");
    var redirectURL = destinationURL + queryParams;
    setTimeout(() => {
      window.location.href = redirectURL;
    }, 100);
  });

  // Function to fetch data from an API
  async function fetchData(url) {
    const response = await fetch(url, {
      headers: {
        Authorization: "1Cgx6oYXkOlWkNDn7_tXO",
      },
    });
    const data = await response.json();
    return data;
  }
  // Function to combine the responses into one JSON array
  async function combineResponses() {
    try {
      let interviewPrepData = await fetchData(interviewPrepURL);
      let switchUpData = await fetchData(switchUpURL);
      // Add new property to each object in the arrays
      interviewPrepData = interviewPrepData.map((item) => ({
        ...item,
        webinar_lead_type: "REGULAR",
      }));
      switchUpData = switchUpData.map((item) => ({
        ...item,
        webinar_lead_type: "SWITCH_UP",
      }));
      // Filter out the entries from interviewPrepData if switchUpData has a value on the same day
      const combinedData = [...interviewPrepData];
      for (const switchUpEntry of switchUpData) {
        const sameDayEntryIndex = combinedData.findIndex(
          (entry) => entry.day === switchUpEntry.day
        );
        if (sameDayEntryIndex !== -1) {
          combinedData.splice(sameDayEntryIndex, 1);
        }
        combinedData.push(switchUpEntry);
      }
      // Sort the combinedData array by start_time
      combinedData.sort(
        (a, b) => new Date(a.start_time) - new Date(b.start_time)
      );
      return combinedData;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  if ($(".bye-calendly-type").val() != "NoPhoneInTheFirstStep") {
    if (document.querySelector("#webinar_pnumber") != null) {
      int_phone3 = window.intlTelInput(
        document.querySelector("#webinar_pnumber"),
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
          hiddenInput: "full",
          utilsScript:
            "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js",
        }
      );
    }
  }
  $(".btn-back-to-step1").click(function (e) {
    $(".webinar__registration-form1").show();
    $(".webinar__registration-success").hide();
    $(".webinar__registration-form1-block").show();
    $(".webinar__registration-form2-block").hide();
  });

  function pushToEndPoint(endpoint) {
    if (webinarType == "ONE_TO_ONE_CONNECT") {
      webinarType = "ONE_TO_ONE_CONNECT";
    } else if (v_timezone_formatted == "Asia/Kolkata") {
      webinarType = "REGULAR";
    } else {
      webinarType == "SWITCH_UP";
    }
    var formData = {
      "First Name": $(".wr__firstname").val(),
      "Last Name": $(".wr__lastname").val(),
      "Email Address": $(".wr__email").val(),
      ByeCalendlyType: $(".bye-calendly-type").val(),
      "webinar-type": $(".webinar-type").val(),
      "Webinar Lead Type": $(".webinar-type").val(),
      utm_source: $(".utm_source").val(),
      utm_medium: $(".utm_medium").val(),
      utm_campaign: $(".utm_campaign").val(),
      utm_content: $(".utm_content").val(),
      utm_adset: $(".utm_adset").val(),
      utm_term: $(".utm_term").val(),

      City: $(".wr__city").val(),
      Device: $(".wr__device").val(),
      Referrer: $(".wr__referrer").val(),
      Region: $(".wr__region").val(),

      gclid: $(".gclid").val(),
      msclkid: $(".msclkid").val(),
      fbclid: $(".fbclid").val(),
      user_id: $(".user_id").val(),
      irclickid: $(".irclickid").val(),

      cta_page_url: $(".cta_page_url").val(),
      landing_page_url: $(".l_page_url").val(),
      event_name: $('input[name="Event Name"]').val(),
      user_timezone: $(".user_timezone").val(),
      page_url: $(".page_url").val(),
      site_url: $(".site_url").val(),
      v_country: $(".v_country").val(),
      salesforce_uuid: $(".salesforce_uuid").val(),
      phone_number_full: $(".tno1").val(),
      is_exit_intent_popup: $(".is_exit_intent_popup").val(),

      "Event Start Time": $(".wr__event-start-time").val(),
      "Event End Time": $(".wr__event-end-time").val(),
      "Invitee Start Time": $(".wr__invitee-start-time").val(),
      "Invitee End Time": $(".wr__invitee-end-time").val(),
      "Booking id": $('input[name="start-date"]:checked').data("bookingid"),
      ipAddress: $("#ipAddress-input").val(),
      browserName: $("#browserName-input").val(),
      browserVersion: $("#browserVersion-input").val()
    };

    $.ajax({
      type: "POST",
      url: endpoint,
      data: formData,
      success: function (e) {
        if (e.status == "success") {
          console.log("Form submitted successfully!");
        }
      },
    });
  }

  $(".bc__btn-select-webinar-slot-v2").click(function (e) {
    e.preventDefault();
    setHiddenFields();

    //let fullphonenumber3 = int_phone3.getNumber(intlTelInputUtils.numberFormat.E164);
    // $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
    //$(".tno1").val(fullphonenumber3);

    $(".first-name, .last-name, .email").keypress(function () {
      $(".first-name-error, .last-name-error,.email-id-error").addClass("hide");
    });

    $(".first-name, .last-name, .email").focus(function () {
      $(".first-name-error, .last-name-error,.email-id-error").addClass("hide");
    });

    //let active_visit = read_cookie("v_latest");
    let name_regex = new RegExp("^[a-zA-Z ]+$");
    let email_regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

    if (
      $(".first-name").val().length == 0 &&
      $(".last-name").val().length == 0 &&
      $(".email").val().length == 0
    ) {
      $(".first-name-error, .last-name-error,.email-id-error").removeClass(
        "hide"
      );
    } else {
      let isInputInvalid = false;
      if (
        !name_regex.test($(".first-name").val()) ||
        $(".first-name").val().length == 0
      ) {
        $(".first-name-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (
        !name_regex.test($(".last-name").val()) ||
        $(".last-name").val().length == 0
      ) {
        $(".last-name-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (
        !email_regex.test($(".email").val()) ||
        $(".email").val().length == 0
      ) {
        $(".email-id-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (!isInputInvalid) {
        $(".webinar__loadingbar").css("display", "flex");
        $(".wr__firstname").val($(".first-name").val());
        $(".wr__lastname").val($(".last-name").val());
        $(".wr__email").val($(".email").val());

        dataLayer.push({
          event: "new_webinar_registration_form_submitted",
          webinar_name: document.querySelector(".webinar__lightbox-title")
            .innerHTML,
        });

        if ($(".is_exit_intent_popup").val() == "On Scroll") {
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_scroll",
            eventAction: "exit_intent_scroll",
            eventLabel: "form submitted",
          });
        }

        if ($(".is_exit_intent_popup").val() == "Browser Tab") {
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_browser_tab_close_gesture",
            eventAction: "exit_intent_browser_tab_close_gesture",
            eventLabel: "form submitted",
          });
        }
        pushToEndPoint(
          "https://hooks.zapier.com/hooks/catch/11068981/34c9jjz/"
        );
        //$('.webinar__registration-form1').submit();
        $(".webinar__registration-form1-block").hide();
        setTimeout(function () {
          $(".webinar__registration-form2-block").show();
          $(".webinar__loadingbar").hide();
        }, 200);
      }
    }
    $("input:radio[name='start-date']:first").attr("checked", true);
    $(".wr__event-start-time").val(
      $("input:radio[name='start-date']:first").val()
    );
    $(".wr__event-end-time").val(
      $("input:radio[name='start-date']:first").data("endtime")
    );
    $(".wr__invitee-start-time").val(
      $("input:radio[name='start-date']:first").data("invitee_starttime")
    );
    $(".wr__invitee-end-time").val(
      $("input:radio[name='start-date']:first").data("invitee_endtime")
    );
    $(".webinar-lead-type").val(
      $("input:radio[name='start-date']:first").data("webinar_lead_type")
    );
  });

  $(".bc__btn-newsletter-subscription").click(function (e) {
    e.preventDefault();
    setHiddenFields();
    let email_regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    $(".email").keypress(function () {
      $(".email-id-error").addClass("hide");
    });

    $(".email").focus(function () {
      $(".email-id-error").addClass("hide");
    });

    if (!email_regex.test($(".email").val()) || $(".email").val().length == 0) {
      $(".email-id-error").removeClass("hide");
    } else {
      $(".wr__emailid").val($(".email").val());
      pushToEndPoint("https://hooks.zapier.com/hooks/catch/11068981/3tvfocs/");

      $(".webinar__loadingbar").css("display", "flex");
      $(".newsletter-subscription-form1").submit();
      $(".newsletter-form-step1").hide();
      $(".webinar__lightbox-subtitle").text(
        "Thank you for signing up to our newsletter. You can also sign up for our webinar for a session on getting into the best tech companies."
      );
      $(".webinar__lightbox-title").text(
        "How to nail your next tech interview"
      );
      setTimeout(function () {
        $(".webinar__registration-form1-block").show();
        $(".webinar__loadingbar").hide();
      }, 200);
    }
  });

  $(".bc__btn-select-webinar-slot-newsletter").click(function (e) {
    e.preventDefault();
    setHiddenFields();

    let fullphonenumber3 = int_phone3.getNumber(
      intlTelInputUtils.numberFormat.E164
    );
    $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
    $(".tno1").val(fullphonenumber3);

    $(".first-name, .last-name, .phone").keypress(function () {
      $(".first-name-error, .last-name-error,.phone-error").addClass("hide");
    });

    $(".first-name, .last-name, .phone").focus(function () {
      $(".first-name-error, .last-name-error,.phone-error").addClass("hide");
    });

    //let active_visit = read_cookie("v_latest");
    let name_regex = new RegExp("^[a-zA-Z ]+$");
    let phone_regex =
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

    if (
      $(".first-name").val().length == 0 &&
      $(".last-name").val().length == 0 &&
      $(".phone").val().length == 0
    ) {
      $(".first-name-error, .last-name-error,.phone-error").removeClass("hide");
    } else {
      let isInputInvalid = false;
      if (
        !name_regex.test($(".first-name").val()) ||
        $(".first-name").val().length == 0
      ) {
        $(".first-name-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (
        !name_regex.test($(".last-name").val()) ||
        $(".last-name").val().length == 0
      ) {
        $(".last-name-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (
        !phone_regex.test($(".phone").val()) ||
        $(".phone").val().length == 0
      ) {
        $(".phone-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (!isInputInvalid) {
        $(".webinar__loadingbar").css("display", "flex");
        $(".wr__firstname").val($(".first-name").val());
        $(".wr__lastname").val($(".last-name").val());
        $(".wr__email").val($(".email").val());
        $(".wr__phone").val(fullphonenumber3);

        dataLayer.push({
          event: "new_webinar_registration_form_submitted",
          webinar_name: document.querySelector(".webinar__lightbox-title")
            .innerHTML,
        });

        if ($(".is_exit_intent_popup").val() == "On Scroll") {
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_scroll",
            eventAction: "exit_intent_scroll",
            eventLabel: "form submitted",
          });
        }

        if ($(".is_exit_intent_popup").val() == "Browser Tab") {
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_browser_tab_close_gesture",
            eventAction: "exit_intent_browser_tab_close_gesture",
            eventLabel: "form submitted",
          });
        }

        pushToEndPoint(
          "https://hooks.zapier.com/hooks/catch/11068981/340hd4j/"
        );

        //$('.webinar__registration-form1').submit();
        $(".webinar__registration-form1-block").hide();
        setTimeout(function () {
          $(".webinar__registration-form2-block").show();
          $(".webinar__loadingbar").hide();
        }, 200);
      }
    }
    $("input:radio[name='start-date']:first").attr("checked", true);
    $(".wr__event-start-time").val(
      $("input:radio[name='start-date']:first").val()
    );
    $(".wr__event-end-time").val(
      $("input:radio[name='start-date']:first").data("endtime")
    );
    $(".wr__invitee-start-time").val(
      $("input:radio[name='start-date']:first").data("invitee_starttime")
    );
    $(".wr__invitee-end-time").val(
      $("input:radio[name='start-date']:first").data("invitee_endtime")
    );
    $(".webinar-lead-type").val(
      $("input:radio[name='start-date']:first").data("webinar_lead_type")
    );
  });

  $(".bc__btn-select-webinar-slot").click(function (e) {
    e.preventDefault();
    setHiddenFields();

    //let fullphonenumber3 = int_phone3.getNumber(intlTelInputUtils.numberFormat.E164);
    //$("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
    //$(".tno1").val(fullphonenumber3);

    $(".full-name,.email").keypress(function () {
      $(".full-name-error,.email-id-error").addClass("hide");
    });

    $(".full-name, .email").focus(function () {
      $(".full-name-error,.email-id-error").addClass("hide");
    });

    let name_regex = new RegExp("^[a-zA-Z ]+$");
    let email_regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

    if ($(".full-name").val().length == 0 && $(".email").val().length == 0) {
      $(".full-name-error,.email-id-error").removeClass("hide");
    } else if (
      !name_regex.test($(".full-name").val()) ||
      $(".full-name").val().length == 0
    ) {
      $(".full-name-error").removeClass("hide");
    } else if (
      !email_regex.test($(".email").val()) ||
      $(".email").val().length == 0
    ) {
      $(".email-id-error").removeClass("hide");
    } else {
      $(".webinar__loadingbar").css("display", "flex");
      let fullname = $(".full-name").val();

      if (fullname.substring(0, fullname.indexOf(" ")) == "") {
        $(".wr__firstname").val(fullname.substring(fullname.indexOf(" ") + 1));
        $(".wr__lastname").val("IK");
      } else if (fullname.substring(fullname.indexOf(" ") + 1) == "") {
        $(".wr__firstname").val(fullname.substring(0, fullname.indexOf(" ")));
        $(".wr__lastname").val(fullname.substring(0, fullname.indexOf(" ")));
      } else {
        $(".wr__firstname").val(fullname.substring(0, fullname.indexOf(" ")));
        $(".wr__lastname").val(fullname.substring(fullname.indexOf(" ") + 1));
      }

      $(".wr__email").val($(".email").val());

      dataLayer.push({
        event: "new_webinar_registration_form_submitted",
        webinar_name: document.querySelector(".webinar__lightbox-title")
          .innerHTML,
      });

      if ($(".is_exit_intent_popup").val() == "On Scroll") {
        dataLayer.push({
          event: "exit_intent",
          eventCategory: "exit_intent_scroll",
          eventAction: "exit_intent_scroll",
          eventLabel: "form submitted",
        });
      }

      if ($(".is_exit_intent_popup").val() == "Browser Tab") {
        dataLayer.push({
          event: "exit_intent",
          eventCategory: "exit_intent_browser_tab_close_gesture",
          eventAction: "exit_intent_browser_tab_close_gesture",
          eventLabel: "form submitted",
        });
      }

      //$('.webinar__registration-form1').submit();
      $(".webinar__registration-form1-block").hide();
      setTimeout(function () {
        $(".webinar__registration-form2-block").show();
        $(".webinar__loadingbar").hide();
      }, 200);
    }
    $("input:radio[name='start-date']:first").attr("checked", true);
    $(".wr__event-start-time").val(
      $("input:radio[name='start-date']:first").val()
    );
    $(".wr__event-end-time").val(
      $("input:radio[name='start-date']:first").data("endtime")
    );
    $(".wr__invitee-start-time").val(
      $("input:radio[name='start-date']:first").data("invitee_starttime")
    );
    $(".wr__invitee-end-time").val(
      $("input:radio[name='start-date']:first").data("invitee_endtime")
    );
    $(".webinar-lead-type").val(
      $("input:radio[name='start-date']:first").data("webinar_lead_type")
    );
  });

  $(".bc__upworth-next").click(function (e) {
    e.preventDefault();
    let expSelected = $(".gql-exp-select").val();
    let domainSelected = $(".gql-domain-select").val();

    if (expSelected == "") {
      $(".work-exp-error").removeClass("hide");
    } else if (domainSelected == "") {
      $(".domain-error").removeClass("hide");
    } else {
      $(".gql-work-experience").val(expSelected);
      $(".gql-role-domain").val(domainSelected);
      $(".webinar__registration-form1-block-s1").hide();
      $(".webinar__registration-form1-block-s2").show();
    }
  });
  $(".bc__upworth-step2").click(function (e) {
    e.preventDefault();
    setHiddenFields();
    let expSelected = $(".gql-exp-select").val();
    let domainSelected = $(".gql-domain-select").val();

    /*let fullphonenumber3 = int_phone3.getNumber(intlTelInputUtils.numberFormat.E164);
    $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
    $(".tno1").val(fullphonenumber3);*/

    $(".first-name, .last-name, .email").keypress(function () {
      $(".first-name-error, .last-name-error,.email-id-error").addClass("hide");
    });

    $(".first-name, .last-name, .email").focus(function () {
      $(".first-name-error, .last-name-error,.email-id-error").addClass("hide");
    });

    //let active_visit = read_cookie("v_latest");
    let name_regex = new RegExp("^[a-zA-Z ]+$");
    let email_regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

    if (
      $(".first-name").val().length == 0 &&
      $(".last-name").val().length == 0 &&
      $(".email").val().length == 0
    ) {
      $(".first-name-error, .last-name-error,.email-id-error").removeClass(
        "hide"
      );
    } else {
      let isInputInvalid = false;
      if (
        !name_regex.test($(".first-name").val()) ||
        $(".first-name").val().length == 0
      ) {
        $(".first-name-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (
        !name_regex.test($(".last-name").val()) ||
        $(".last-name").val().length == 0
      ) {
        $(".last-name-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (
        !email_regex.test($(".email").val()) ||
        $(".email").val().length == 0
      ) {
        $(".email-id-error").removeClass("hide");
        isInputInvalid = true;
      }
      if (!isInputInvalid) {
        $(".webinar__loadingbar").css("display", "flex");

        dataLayer.push({
          event: "new_webinar_registration_form_submitted",
          webinar_name: document.querySelector(".webinar__lightbox-title")
            .innerHTML,
        });

        pushToEndPoint(
          "https://hooks.zapier.com/hooks/catch/11068981/3hp515j/"
        );
        //$('.profile-analysis-step1').submit();
        setTimeout(function () {
          location.href =
            "/upworth-profile-analysis?domain=" +
            domainSelected +
            "&workexp=" +
            expSelected +
            "&email=" +
            $(".email").val() +
            "&fname=" +
            $(".first-name").val() +
            "&lname=" +
            $(".last-name").val();
        }, 200);
      }
    }
  });

  $(".bc__btn-2nd-step").click(function (e) {
    e.preventDefault();
    let utm_parms = getAllUrlParams();

    if ($("input:radio[name='start-date']").is(":checked")) {
      let estarttime = $('input[name="start-date"]:checked').val();
      let eendtime = $('input[name="start-date"]:checked').data("endtime");
      let utmm = visitor_id + ":" + v_country;
      let sf_uuid =
        v_timezone +
        ":ik.com" +
        cta_lp +
        ":ik.com" +
        getCookie("ik-landingpage-v2");
      let utmstr =
        "&" + (window.location.search == "")
          ? ""
          : window.location.search.slice(1);
      //  let utmstring = "?utm_source=" + $('.utm_source').val() + "&assigned_to=Interview Kickstart&invitee_first_name=" + $('.wr__firstname').val() + "&invitee_last_name=" + $('.wr__lastname').val() + "&invitee_email=" + $('.wr__email').val() + "&answer_1=" + $('.wr__phone').val() + "&event_start_time=" + estarttime + "&event_end_time=" + eendtime + "&utm_medium=" + utmm + "&salesforce_uuid=" + sf_uuid + "&forceuswebinar=" + utm_parms['forceuswebinar'] + utmstr;

      let utmstring =
        "?utm_source=" +
        $(".utm_source").val() +
        "&utm_medium=" +
        utmm +
        "&salesforce_uuid=" +
        sf_uuid +
        "&forceuswebinar=" +
        utm_parms["forceuswebinar"] +
        utmstr;

      let finalurl;
      if ($(".bye-calendly-type").val() == "NoPhoneInTheFirstStep") {
        finalurl = getLearnGQLLink() + utmstring;
      } else {
        finalurl =
          "https://www.interviewkickstart.com/signup-final-step" + utmstring;
      }
      $(".wr__event-start-time").val(estarttime);
      $(".wr__event-end-time").val(eendtime);
      $(".wr__invitee-start-time").val(
        $("input[name='start-date']:checked").data("invitee_starttime")
      );
      $(".wr__invitee-end-time").val(
        $("input[name='start-date']:checked").data("invitee_endtime")
      );
      $(".webinar-lead-type").val(
        $("input[name='start-date']:checked").data("webinar_lead_type")
      );

      $(".webinar__loadingbar").show();

      let promise = new Promise((resolve, reject) => {
        try {
          if (is_webinar_1o1_eligible) {
            $.ajax({
              url: "https://uplevel.interviewkickstart.com/api/v1/webinar_connect/book-slot/",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                slot_id: parseInt(
                  $('input[name="start-date"]:checked').data("slotid")
                ),
                email: $(".email").val(),
              }),
              success: function (res) {
                $('input[name="start-date"]:checked').data(
                  "bookingid",
                  res.booking_id
                );
                console.log("Form submitted successfully!");
                resolve();
              },
              error: function (err) {
                console.error(
                  "1:1 Slot booking failed submission failed!",
                  err
                );
                resolve();
              },
            });
          } else {
            resolve();
          }
        } catch (error) {
          console.error("Try catch failed at 1:1 Slot API code", err);
          resolve();
        }
      });

      promise.then(() => {
        if (is_webinar_1o1_eligible) {
          pushToEndPoint(
            "https://hooks.zapier.com/hooks/catch/11068981/2dvppke/"
          );
        } else {
          pushToEndPoint(
            "https://hooks.zapier.com/hooks/catch/11068981/34cq9f8/"
          );
        }
      });

      //$('.webinar__registration-form2').submit();

      bake_cookie("v_history", "");
      bake_cookie("v_latest", "");

      if (singlesignup != true) {
        try {
          saveClickActivity(
            "Webinar-modal_button_open-gql",
            new Date().getTime(),
            () => {
              location.href = finalurl;
            }
          );
        } catch (error) {
          setTimeout(function () {
            location.href = finalurl;
          }, 800);
        }
      } else {
        $(".webinar__loadingbar").hide();
        $(".webinar__registration-form2-block").hide();
        $(".webinar__registration-form3-block").show();
      }

      let previousData = {
        firstName: $(".wr__firstname").val(),
        lastName: $(".wr__lastname").val(),
        email: $(".wr__email").val(),
        site_url: iksite_url,
        eventStartTime: $(".wr__event-start-time").val(),
        eventEndTime: $(".wr__event-end-time").val(),
        inviteeStartTime: $(".wr__invitee-start-time").val(),
        inviteeEndTime: $(".wr__invitee-end-time").val(),
        cta_url: $(".cta_page_url").val(),
        USUserId: $(".user_id").val(),
        landing_page_url: $(".l_page_url").val(),
        UTM_Campaign: $(".utm_campaign").val(),
        UTM_Source: $(".utm_source").val(),
        UTM_Medium: $(".utm_medium").val(),
        UTM_Term: $(".utm_term").val(),
        UTM_Content: $(".utm_content").val(),
      };
      var jsonData = JSON.stringify(previousData);
      console.log(jsonData);
      var cookieName = "previousData";
      var cookieValue = encodeURIComponent(jsonData);
      var expirationTime = new Date(
        new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000
      );
      var currentHostname = window.location.hostname;
      var hostnameParts = currentHostname.split(".");
      if (hostnameParts.length > 1) {
        hostnameParts.shift();
      }
      var domain = hostnameParts.join(".");
      setTimeout(() => {
        console.log("---SET COOKIES---", domain);
        if (isDev()) {
          document.cookie =
            cookieName +
            "=" +
            cookieValue +
            "; expires=" +
            expirationTime +
            "; path=/; domain=ikdev.webflow.io";
        } else {
          document.cookie =
            cookieName +
            "=" +
            cookieValue +
            "; expires=" +
            expirationTime +
            "; path=/; domain=" +
            domain;
        }
      }, 500);

      //lead LeadCreatedTime
      const currentDateTime = new Date();
      const LeadCreatedTime = currentDateTime
        .toISOString()
        .replace(/T/, " ")
        .replace(/\.\d+Z$/, " UTC");
      //convert UTC time format
      function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
      }
      const formattedStartDateTime = formatDateTime(
        $(".wr__event-start-time").val()
      );
      const formattedEndDateTime = formatDateTime(
        $(".wr__event-end-time").val()
      );

      let data = [
        {
          Lead_Created_Time: LeadCreatedTime,
          Lead_Name: previousData.firstName + " " + previousData.lastName,
          Lead_First_Name: previousData.firstName,
          Lead_Last__Name: previousData.lastName,
          Lead_Email: previousData.email,
          Lead_Time_Zone: $(".user_timezone").val(),
          Event_Type_Name: $('input[name="Event Name"]').val(),
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
          User_ID: $(".user_id").val(),
          Page_URL: encodeURIComponent($(".page_url").val()),
          Country: $(".v_country").val(),
          Client_Timezone: $(".user_timezone").val(),
          CTA_Page: encodeURIComponent($(".cta_page_url").val()),
          Landing_Page: encodeURIComponent(previousData.landing_page_url),
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
        },
      ];

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
          data: data,
        }),
        success: function (e) {
          console.log("Success Response:", e);
          console.log("Click_history-data:", data);
        },
        error: function (xhr, status, error) {
          console.log("Error Response:", xhr.responseText);
          console.log("Status:", status);
          console.log("Error:", error);
        },
      });
    }
  });
  //lead LeadCreatedTime
  const currentDateTime = new Date();
  // const LeadCreatedTime = currentDateTime.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, ' UTC');
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  const hours = now.getUTCHours().toString().padStart(2, "0");
  const minutes = now.getUTCMinutes().toString().padStart(2, "0");
  const seconds = now.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = now.getUTCMilliseconds();
  var newDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} UTC`;
  setTimeout(() => {
    let data1 = [
      {
        Lead_Created_Time: currentDateTime,
        Lead_Time_Zone: encodeURIComponent($(".user_timezone").val()),
        Event_Type_Name: encodeURIComponent(
          $('input[name="Event Name"]').val()
        ),
        Cancellation_reason: "",
        UTM_Campaign: encodeURIComponent($(".utm_campaign").val()),
        UTM_Source: encodeURIComponent($(".utm_source").val()),
        UTM_Medium: encodeURIComponent($(".utm_medium").val()),
        UTM_Term: encodeURIComponent($(".utm_term").val()),
        UTM_Content: encodeURIComponent($(".utm_content").val()),
        Tracking_ID: "",
        User_ID: encodeURIComponent($(".user_id").val()),
        Page_URL: encodeURIComponent($(".page_url").val()),
        Country: encodeURIComponent($(".v_country").val()),
        Client_Timezone: encodeURIComponent($(".user_timezone").val()),
        CTA_Page: encodeURIComponent($(".cta_page_url").val()),
        Landing_Page: encodeURIComponent($(".l_page_url").val()),
        Click_History: "",
        City: encodeURIComponent($(".wr__city").val()),
        Device: encodeURIComponent($(".wr__device").val()),
        User_Agent: encodeURIComponent(navigator?.userAgent || ""),
        Refferer: encodeURIComponent($(".wr__referrer").val()),
        Region: encodeURIComponent($(".wr__region").val()),
        New_Lead_Created_Time: encodeURIComponent(newDate),
      },
    ];
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
        data: data1,
      }),
      success: function (e) {
        // console.log("Success Response:", e);
        console.log("Click_history-data:", data1);
      },
      error: function (xhr, status, error) {
        console.log("Error Response:", xhr.responseText);
        console.log("Status:", status);
        console.log("Error:", error);
      },
    });
  }, "3000");
});

function render1o1Slots(slotsDates, selectionHandler = () => { }) {
  if (!slotsDates || Object.keys(slotsDates).length === 0) {
    $(".webinar__slots").html("<p>No slots available</p>");
    return;
  }

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function convertUTCToLocal(availableSlots) {
    const localSlots = {};

    for (const date in availableSlots) {
      for (const time in availableSlots[date]) {
        const utcDateTime = new Date(`${date}T${time}:00Z`);
        const localDateTime = new Date(
          utcDateTime.toLocaleString("en-US", { timeZone: localTimeZone })
        );

        const localDate = `${localDateTime.getFullYear()}-${(
          "0" + (localDateTime.getMonth() + 1)
        ).slice(-2)}-${("0" + localDateTime.getDate()).slice(-2)}`;
        const localTime = localDateTime
          .toTimeString()
          .split(" ")[0]
          .slice(0, 5);

        if (!localSlots[localDate]) {
          localSlots[localDate] = {};
        }

        localSlots[localDate][localTime] = availableSlots[date][time];
      }
    }

    return localSlots;
  }

  slotsDates = convertUTCToLocal(slotsDates);

  console.log("1:1 Slots rendered");

  $(".webinar__slots").css({
    display: "flex",
    "flex-direction": "column",
    "justify-content": "space-between",
  });
  $(".webinar__slots").html(`
      <div style="display: flex; gap: 20px;">
        <div style="flex-grow: 1; position:sticky; top:0px; max-height:300px; overflow-y :auto;">
          <h4>Select a Date</h4>
          <div style="display: flex; flex-direction: column;" id="date-list"></div>
        </div>
        <div style="border-left: 1px solid #ddd; position:sticky; top:0px;"></div>
        <div style="flex-grow: 1;  max-height:300px; overflow-y :auto;">
          <h4>Time slots</h4>
          <div style="display: flex; flex-direction: column;" id="time-list"></div>
        </div>
      </div>
      <span id="input-placeholder-1o1"> </span>
      <p id="timezone" style="margin-top: 12px;"></p>
    `);

  const buttonCommonStyles = `color: #000; cursor: pointer; padding: 10px; margin-bottom: 5px; cursor: pointer; padding: 10px; margin-bottom: 5px; border-radius: 8px; border: 1px solid #5494cd;`;

  // Populate dates and time slots
  function populateDates() {
    const dateList = $(".webinar__slots #date-list");
    const timezoneDisplay = $(".timezone-disclaimer");

    // Display timezone
    timezoneDisplay.text(`Time Zone: ${localTimeZone}`);

    Object.keys(slotsDates)
      .sort((a, b) => {
        const timeA = new Date(`${a}T00:00`).getTime();
        const timeB = new Date(`${b}T00:00`).getTime();
        return timeA - timeB;
      })
      .map((date, index) => {
        const localDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });
        const dateBtn = $(`<button type="button" style="${buttonCommonStyles} ${index === 0
            ? "background-color: #5494cd; color:#fff; font-weight:600;"
            : "background-color: #fff;"
          }">
            ${localDate}</button>`);

        dateBtn.click(function () {
          $(".webinar__slots #date-list button").css({
            "background-color": "#fff",
            color: "#000",
            fontWeight: "400",
          }); // Reset all buttons
          $(this).css({
            "background-color": "#5494cd",
            color: "#fff",
            fontWeight: "600",
          }); // Highlight clicked date
          populateTimeSlots(date); // Load time slots for the selected date
        });

        dateList.append(dateBtn);
        return dateBtn;
      })[0]
      ?.click?.(); // Select the first date by default
  }

  function populateTimeSlots(selectedDate) {
    const timeList = $(".webinar__slots #time-list");
    timeList.empty(); // Clear previous time slots

    const times = slotsDates[selectedDate];
    Object.keys(times).sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a}:00`).getTime();
        const timeB = new Date(`1970-01-01T${b}:00`).getTime();
        return timeA - timeB;
      }).forEach((time, index) => {
        const timeBtn = $(
          `<button type="button" style="${buttonCommonStyles} background-color: #fff;">${time.toUpperCase()}</button>`
        );

        timeBtn.click(function () {
          $(".webinar__slots #time-list button").css({
            "background-color": "#fff",
            color: "#000",
            fontWeight: "400",
          }); // Reset all buttons
          $(this).css({
            "background-color": "#5494cd",
            color: "#fff",
            fontWeight: "600",
          }); // Highlight clicked time
          selectionHandler?.(times[time]); // Callback function
          console.log(selectedDate, time, `Slot ID: ${times[time]} selected`); // Alert the slot ID

          const startDate = new Date(`${selectedDate}T${time}:00`);
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

          const inviteeStartTime =
            startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }) +
            " - " +
            startDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            });
          const inviteeEndTime =
            endDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }) +
            " - " +
            endDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            });
          function formatDateWithTimezoneOffset(date) {
            const timezoneOffset = -date.getTimezoneOffset(); // offset in minutes
            const diffHours = Math.floor(timezoneOffset / 60);
            const diffMinutes = timezoneOffset % 60;
            const sign = diffHours >= 0 ? "+" : "-";
            const pad = (num) => String(Math.abs(num)).padStart(2, "0");
            return (
              date.getFullYear() +
              "-" +
              pad(date.getMonth() + 1) +
              "-" +
              pad(date.getDate()) +
              "T" +
              pad(date.getHours()) +
              ":" +
              pad(date.getMinutes()) +
              ":" +
              pad(date.getSeconds()) +
              sign +
              pad(diffHours) +
              ":" +
              pad(diffMinutes)
            );
          }
          $("#input-placeholder-1o1").html(
            `<input 
              data-slotid="${times[time]
            }" hidden type="radio" name="start-date" value="${formatDateWithTimezoneOffset(
              startDate
            )}" data-endtime="${formatDateWithTimezoneOffset(
              endDate
            )}" data-invitee_starttime="${inviteeStartTime}" data-invitee_endtime="${inviteeEndTime}" data-name="${formatDateWithTimezoneOffset(
              startDate
            )}" class="w-form-formradioinput select-webinar-radio-btn w-radio-input" data-webinar_lead_type="ONE_TO_ONE_CONNECT" checked="checked" />`
          );
        });

        timeList.append(timeBtn);
        setTimeout(() => {
          if (index === 0) timeBtn.click(); // Select the first time slot by default
        }, 0);
      });
  }

  populateDates();
}
