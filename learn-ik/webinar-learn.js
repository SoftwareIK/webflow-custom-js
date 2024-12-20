/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /gh/kothinti/ik@master/ep-webinar-learn-v1.5.3.js
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var experiment_type,
  exitintent_freecourse,
  v_timezone_formatted,
  interviewPrepURL,
  switchUpURL,
  eventUpsightDate,
  webinarSlotDate,
  is_webinar_1o1_eligible,
  callCreateWebinarSlot;

function getDeviceType() {
  var e = navigator.userAgent;
  return /mobile/i.test(e)
    ? "Mobile"
    : /iPad|Android|Touch/i.test(e)
      ? "Tablet"
      : "Desktop";
}
function isDev() {
  return location?.host?.includes("webflow");
}

function getLearnGQLLink() {
  const host = isDev()
    ? "https://ikdev.webflow.io"
    : "https://www.interviewkickstart.com";
  if (webinarType == "SWITCH_UP") {
    return `${host}/signup-final-step-switchup`;
  }
  return `${host}/signup-final-step`;
}

function formattedWebinarDate(webinarData, webinarFormat) {
  return `<div class="webinar-event-date" bis_skin_checked="1"  data-starttime="${webinarData.start_time}" data-endtime="${webinarData.end_time}" data-invitee_starttime="${webinarData.invitee_start_time}"  data-invitee_endtime="${webinarData.invitee_end_time}" data-name="${webinarData.start_time}" data-webinar_lead_type="${webinarData.webinar_lead_type}">  ${webinarFormat} </div>`;
}
//Set PA cookies Data
function paRegisteredCookie() {
  if (typeof paRegistered !== "undefined") {
    var paCookieValue = getCookie("Pa Data");
    if (paCookieValue !== null) {
      var decodedData = decodeURIComponent(paCookieValue);
      var decodedObject = JSON.parse(decodedData);
      $(".utm_source").val(decodedObject.utm_source);
      $(".webinar-type").val(decodedObject.webinar_Type);
    } else {
      console.log("Cookie not found");
    }
  }
}

function initObservers() {
  let scrollPosition = 0;
  try {
    if (window.MutationObserver) {
      // Function to handle mutation
      function handleMutation(mutations) {
        mutations.forEach(function (mutation) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            var target = $(mutation.target);
            if (
              target.hasClass("webinar__registration-form1") &&
              target.css("display") === "none"
            ) {
              target.css("display", "block");
              $(".w-form-done").css("display", "none");
              $(".w-form-fail").css("display", "none");
            }

            if (
              target.hasClass("w-form-fail") &&
              target.css("display") !== "none"
            ) {
              target.css("display", "none");
            }

            if (target.hasClass("webinar__lightbox")) {
              if (
                target.css("display") !== "none" &&
                target.css("visibility") !== "hidden"
              ) {
                scrollPosition = $(window).scrollTop();

                $("body").css({
                  overflow: "hidden",
                  position: "fixed",
                  top: `-${scrollPosition}px`,
                  width: "100%",
                });
              } else {
                $("body").css({
                  overflow: "",
                  position: "",
                });
                $(window).scrollTop(scrollPosition);
              }
            }
          }
        });
      }
      // Create an observer instance
      var observer = new MutationObserver(handleMutation);

      // Configuration of the observer
      var config = { attributes: true, attributeFilter: ["style"] };

      // Observe all forms under .v2-form-container
      $(".webinar__registration-form1, .w-form-fail, .webinar__lightbox").each(
        function () {
          observer.observe(this, config);
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

$(document).ready(function () {
  initObservers();
  var e;
  let t = getAllUrlParams();
  async function a(e) {
    const t = await fetch(e, {
      headers: {
        Authorization: "1Cgx6oYXkOlWkNDn7_tXO",
      },
    });
  }

  is_webinar_1o1_eligible = webinarType === "ONE_TO_ONE_CONNECT";

  $("#fullName").on("input", function () {
    var fullName = $.trim($(this).val());

    if (fullName === "") {
      $(".first-name").val("");
      $(".last-name").val("");
    } else {
      var nameParts = fullName.split(/\s+/);
      var firstName = nameParts[0];
      var lastName = "";

      if (nameParts.length > 1) {
        lastName = nameParts.slice(1).join(" ");
      }

      $(".first-name").val(firstName);
      $(".last-name").val(lastName);
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

  function n(e) {
    const t = [
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
    0 == e.length
      ? (registration_type = "calendly")
      : (registration_type = "byecalendly");
    let a = e.length > 6 ? 6 : e.length;

    function setWebinarFirstTimeSlot() {
      var n =
        e[0].weekday +
        ", " +
        e[0].day +
        " " +
        t[parseInt(e[0].month) - 1] +
        " " +
        e[0].year +
        " | " +
        e[0].hour +
        ":" +
        e[0].minute +
        " " +
        e[0].am_or_pm;
      webinarSlotDate = formattedWebinarDate(e[0], n);
      $(".webinar__slots").append($(webinarSlotDate));
    }
    /** This function use for set UTM Params in event Upsight Pages  */
    function updateUTMParameters() {
      // Function to check if UTM parameters exist in the URL
      function utmParamsExist(url) {
        return url.includes("webinarType=") && url.includes("eventDate=");
      }
      // Check if UTM parameters already exist in the URL
      if (!utmParamsExist(window.location.href)) {
        var currentUrl = window.location.href;
        var separator = currentUrl.indexOf("?") !== -1 ? "&" : "?";
        var newUrl =
          currentUrl +
          separator +
          "webinarType=" +
          webinarType +
          "&eventDate=" +
          e[0].start_time;
        // Update URL and set webinar title
        window.location.href = newUrl;
        //$(".webinar__lightbox-title").text(decodeURIComponent(event));
      }
    }
    /**
     * Check for the range difference in the dates and set the nearest date accordingly.
     * @param {*} rangeStart - indicates start date
     * @param {*} rangeEnd - indicates end data
     */
    function closestBoundaryInRange(rangeStart, rangeEnd) {
      const eventDate = getAllUrlParams()?.eventdate;
      const months = [
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
      const diffToStart = Math.abs(new Date(eventDate) - new Date(rangeStart));
      const diffToEnd = Math.abs(new Date(eventDate) - new Date(rangeEnd));
      if (diffToStart <= diffToEnd || diffToStart >= diffToEnd) {
        const eventUpsightData = diffToStart <= diffToEnd ? e[0] : e[1];
        const eventSightUpformat =
          eventUpsightData.weekday +
          ", " +
          eventUpsightData.day +
          " " +
          months[parseInt(eventUpsightData.month) - 1] +
          " " +
          eventUpsightData.year +
          " | " +
          eventUpsightData.hour +
          ":" +
          eventUpsightData.minute +
          " " +
          eventUpsightData.am_or_pm;
        const webinarDate = formattedWebinarDate(
          eventUpsightData,
          eventSightUpformat
        );
        $(".webinar__slots").append($(webinarDate));
      } else {
        setWebinarFirstTimeSlot();
      }
    }

    function updateWebinarTimeSlots(eventArray) {
      if (eventArray.length === 2) {
        closestBoundaryInRange(
          eventArray[0].start_time,
          eventArray[1].start_time
        );
      } else {
        setWebinarFirstTimeSlot();
      }
    }
    if (typeof isUpsightReg !== "undefined") {
      eventUpsightDate = e;
      updateUTMParameters();
      updateWebinarTimeSlots(eventUpsightDate);

      /* Below code use for event upsight sessions pages */
      $(".calendly-upsight").on("click", function () {
        if (registration_type == "byecalendly") {
          $("body").css("overflow", "hidden");
          $(".upsight-session").css("display", "flex");
        } else {
          showCalendly("v1");
        }
        $(".webinar__slots .webinar-event-date").remove();
        updateWebinarTimeSlots(eventUpsightDate);
      });
    } else {
      for (i = 0; i < a; i++) {
        var n =
          e[i].weekday +
          ", " +
          e[i].day +
          " " +
          t[parseInt(e[i].month) - 1] +
          " " +
          e[i].year +
          " | " +
          e[i].hour +
          ":" +
          e[i].minute +
          " " +
          e[i].am_or_pm,
          r =
            '<label class="select-webinar-slot w-radio"><input type="radio" name="start-date" value="' +
            e[i].start_time +
            '" data-endtime="' +
            e[i].end_time +
            '" data-invitee_starttime="' +
            e[i].invitee_start_time +
            '" data-invitee_endtime="' +
            e[i].invitee_end_time +
            '" data-name="' +
            e[i].start_time +
            '" class="w-form-formradioinput select-webinar-radio-btn w-radio-input" data-webinar_lead_type="' +
            e[i].webinar_lead_type +
            '"><span class="w-form-label" for="start-date-' +
            i +
            '">' +
            n +
            "</span></label>";
        $(".webinar__slots").append($(r));
      }
    }
  }

  // Mapping of default titles for each webinarType
  const eventTitleMap = {
    CAREER_SESSION: "Seize the AI Advantage: Strengthen Your Resume",
    SWITCH_UP: "Uplevel your career with AI/ML/GenAI",
    ONE_TO_ONE_CONNECT: "How to Nail Your Next Tech/Product Interview",
    DEFAULT: "How to Nail your next Technical Interview",
  };

  // Function to set the event details in the DOM
  const setEventDetails = (title) => {
    // Update the title and input field with the given title
    $(".webinar__lightbox-title").text(title);
    $('input[name="Event Name"]').val(title);
    eventName = title;
  };

  // Function to determine the appropriate event title
  const getEventTitle = (webinarType, event) => {
    // If the event exists, decode it and return
    if (event) {
      return decodeURIComponent(event);
    }

    // Use the appropriate default title based on webinarType
    switch (webinarType) {
      case "CAREER_SESSION":
        return eventTitleMap.CAREER_SESSION;
      case "SWITCH_UP":
        return eventTitleMap.SWITCH_UP;
      case "ONE_TO_ONE_CONNECT":
        return eventTitleMap["ONE_TO_ONE_CONNECT"];
      default:
        return eventTitleMap.DEFAULT;
    }
  };

  // Safely get the event title and set it in the DOM
  const eventTitle = getEventTitle(webinarType, t.event);
  setEventDetails(eventTitle);

  $(".webinar-lightbox-close").click(function (e) {
    "ExitIntent" == experiment_type
      ? ($(".webinar__lightbox-card").css("display", "none"),
        $(".webinar__lightbox-exit-intent").css("display", "block"))
      : 1 == exitintent_freecourse
        ? ($(".webinar__lightbox-card").css("display", "none"),
          $(".webinar__lightbox-free-course").css("display", "block"),
          $(".exitintent-fc-email").val($(".email").val()),
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_free_course",
            eventAction: "exit_intent_free_course",
            eventLabel: "form triggered",
          }))
        : ($(".webinar__lightbox").css("display", "none"),
          $("body").css("overflow", "auto"),
          "On Scroll" == $(".is_exit_intent_popup").val() &&
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_scroll",
            eventAction: "exit_intent_scroll",
            eventLabel: "close",
          }),
          "Browser Tab" == $(".is_exit_intent_popup").val() &&
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_browser_tab_close_gesture",
            eventAction: "exit_intent_browser_tab_close_gesture",
            eventLabel: "close",
          }));
  }),
    $(".btn-getaccess").click(function (e) {
      e.preventDefault();
      $(".exitintent-fc-email").keypress(function () {
        $(".exitintent-fc-email-error").addClass("hide");
      }),
        $(".exitintent-fc-email").focus(function () {
          $(".exitintent-fc-email-error").addClass("hide");
        }),
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
          $(".exitintent-fc-email").val()
        ) && 0 != $(".exitintent-fc-email").val().length
          ? ($(".exit-intent-free-course-form").submit(),
            dataLayer.push({
              event: "exit_intent",
              eventCategory: "exit_intent_free_course",
              eventAction: "exit_intent_free_course",
              eventLabel: "form submitted",
            }),
            $(".webinar-lightbox-exitintent-freecourse-close").hide(),
            setTimeout(function () {
              $(".webinar__lightbox").css("display", "none"),
                $(".webinar__lightbox-free-course").css("display", "none"),
                $(".webinar__lightbox-card").css("display", "flex"),
                $("body").css("overflow", "auto"),
                $(".exit-intent-free-course-form").css("display", "block"),
                $(".success-message-9").css("display", "none"),
                $(".webinar-lightbox-exitintent-freecourse-close").show();
            }, 2e3))
          : $(".exitintent-fc-email-error").removeClass("hide");
    }),
    $(".webinar-lightbox-exitintent-freecourse-close").click(function (e) {
      $(".webinar__lightbox").css("display", "none"),
        $(".webinar__lightbox-free-course").css("display", "none"),
        $(".webinar__lightbox-card").css("display", "flex"),
        $("body").css("overflow", "auto"),
        dataLayer.push({
          event: "exit_intent",
          eventCategory: "exit_intent_free_course",
          eventAction: "exit_intent_free_course",
          eventLabel: "close",
        });
    }),
    $(".bc-popup-cta1").click(function (e) {
      $(".webinar__lightbox-card").css("display", "flex"),
        $(".webinar__lightbox-exit-intent").css("display", "none");
    }),
    $(".bc-popup-cta2").click(function (e) {
      $(".webinar__lightbox-card").css("display", "flex"),
        $(".webinar__lightbox-exit-intent").css("display", "none"),
        $(".webinar__lightbox").css("display", "none"),
        $("body").css("overflow", "auto");
    });

  setTimeout(() => {
    createWebinarSlot(webinarType);
  }, 1000);

  function callAPI(url) {
    let e = new XMLHttpRequest();
    e.open("GET", url, !0),
      e.setRequestHeader("Authorization", "1Cgx6oYXkOlWkNDn7_tXO");
    (e.onload = function () {
      if (200 == this.status) {
        let e = JSON.parse(this.response);
        webinarType = "REGULAR";
        if (webinarType == "REGULAR") {
          e = e.map((e) => ({
            ...e,
            webinar_lead_type: "REGULAR",
          }));
        }
        n(e);
      }
    }),
      e.send();
  }

  function webinar1o1Fallback() {
    is_webinar_1o1_eligible = false;
    webinarType = "REGULAR";
    $(".webinar-lead-type").val("REGULAR");
    $(".webinar-type").val("REGULAR");
    createWebinarSlot(webinarType);
  }

  function createWebinarSlot(webinarType) {
    const timezoneEncoded = v_timezone.replace("+", "%2B");
    const baseURL = is_webinar_1o1_eligible
      ? `https://uplevel.interviewkickstart.com/api/v1/webinar_connect/available-slots/`
      : `https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country=USA&program=Backend&timezone=${timezoneEncoded}&type=`;
    const url = is_webinar_1o1_eligible ? baseURL : baseURL + webinarType;
    const authToken = "1Cgx6oYXkOlWkNDn7_tXO";

    const handleError = () => {
      fallbackSlots()
      // if the API call fails, we'll show the default webinar slot
      if (is_webinar_1o1_eligible) {
        webinar1o1Fallback();
        return;
      }

      TimerHandler(null);
      // This fillWebinarSlots is for v2-homepage.
      if (typeof fillWebinarSlots === "function") {
        fillWebinarSlots(null);
      }
      registration_type = "calendly";
    };

    const fallbackSlots = () => {
      webinarType = "REGULAR";
      const url = `https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/`;
      const timezone = "America/New_York"
      callAPI(`${url}?country=USA&program=Backend&timezone=${timezone}&type=${webinarType}`);
    }

    const processWebinarData = (data, webinarType) => {
      // Check if the webinar type is ONE_TO_ONE_CONNECT and if data contains any non-empty objects
      if (is_webinar_1o1_eligible) {
        if (Object.values(data).some((times) => Object.keys(times).length)) {
          render1o1Slots(data);
          if (typeof fillWebinarSlots === "function") {
            fillWebinarSlots(null);
          }
          registration_type = "byecalendly";
        } else {
          // If the data is empty, we'll show the default webinar slot
          webinar1o1Fallback();
        }
        return;
      } else if (Array.isArray(data) && data.length === 0) {
        registration_type = "calendly";
        webinarType = "REGULAR";
        callAPI(baseURL + webinarType);
      } else {
        registration_type = "byecalendly";
      }

      const processedData = data.map((slot) => ({
        ...slot,
        webinar_lead_type: webinarType,
      }));

      TimerHandler(processedData);
      if (typeof fillWebinarSlots === "function") {
        fillWebinarSlots(processedData);
      }
      n(processedData);
    };

    // Handle non-switch up logic (when isSwitchUp is "No")
    const fetchWebinarSlotsWithXMLHttpRequest = () => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Authorization", authToken);

      xhr.onload = function () {
        if (this.status === 200) {
          try {
            const response = typeof this.response === "string" ? JSON.parse(this.response) : this.response;
            if (response == null || response == undefined) {
              fallbackSlots();
            } 
            processWebinarData(response, webinarType);
          } catch (error) {
            console.error("Error:", error);
            handleError();
          }
        } else {
          handleError();
        }
      };

      xhr.onerror = handleError;
      xhr.send();
    };

    // Handle switch up logic (when isSwitchUp is not "No")
    const fetchWebinarSlotsAsync = async () => {
      const interviewPrepURL = baseURL + "REGULAR";
      const switchUpURL = baseURL + "SWITCH_UP";

      try {
        const [interviewPrepData, switchUpData] = await Promise.all([
          a(interviewPrepURL),
          a(switchUpURL),
        ]);

        const processedInterviewPrepData = interviewPrepData.map((slot) => ({
          ...slot,
          webinar_lead_type: "REGULAR",
        }));

        const processedSwitchUpData = switchUpData.map((slot) => ({
          ...slot,
          webinar_lead_type: "SWITCH_UP",
        }));

        const combinedData = [...processedInterviewPrepData];
        for (const switchUpSlot of processedSwitchUpData) {
          const index = combinedData.findIndex(
            (slot) => slot.day === switchUpSlot.day
          );
          if (index !== -1) {
            combinedData.splice(index, 1); // Remove conflicting slot
          }
          combinedData.push(switchUpSlot); // Add switch up slot
        }

        combinedData.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );

        TimerHandler(combinedData);
        if (typeof fillWebinarSlots === "function") {
          fillWebinarSlots(combinedData);
        }
        n(combinedData);
      } catch (error) {
        handleError();
        console.error("Error:", error);
      }
    };

    // Logic branching based on isSwitchUp flag
    if (isSwitchUp === "No") {
      fetchWebinarSlotsWithXMLHttpRequest();
    } else {
      fetchWebinarSlotsAsync().then((data) => {
        TimerHandler(data);
        if (typeof fillWebinarSlots === "function") {
          fillWebinarSlots(data);
        }
        n(data);
      });
    }
  }

  callCreateWebinarSlot = createWebinarSlot;

  function s(e) {
    var t = {
      "First Name": $(".wr__firstname").val(),
      "Last Name": $(".wr__lastname").val(),
      "Email Address": $(".wr__email").val(),
      ByeCalendlyType: $(".bye-calendly-type").val(),
      "webinar-type": $(".webinar-type").val(),
      "Webinar Lead Type": $(".webinar-lead-type").val(),
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
      cta_page_url: $(".cta_page_url").val(),
      landing_page_url: $(".l_page_url").val(),
      event_name: eventName,
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
      "Work Experience": $(".gql-work-experience").val(),
      "Domain or Role": $(".gql-role-domain").val(),
      "Pa Name": $(".wr__pa-name").val(),
      "Pa Email": $(".wr__pa-email").val(),
      "Booking id": $('input[name="start-date"]:checked').data("bookingid"),
      "irclickid": $(".irclickid").val(),
      ipAddress: $("#ipAddress-input").val(),
      browserName: $("#browserName-input").val(),
      browserVersion: $("#browserVersion-input").val()
    };
    
    const partnerDetails = read_cookie("partner_details");
    if(partnerDetails) {
      t["Partner Name"] = partnerDetails?.partner_name;
      t["is_partnership_lead"] = partnerDetails?.is_partnership_lead
      t["is_user_eligible_for_partnership_discount"] = partnerDetails?.is_user_eligible_for_partnership_discount
    }

    $.ajax({
      type: "POST",
      url: e,
      data: t,
      success: function (e) {
        "success" == e.status && console.log("Form submitted successfully!");
      },
    });
  }
  "NoPhoneInTheFirstStep" != $(".bye-calendly-type").val() &&
    null != document.querySelector("#webinar_pnumber") &&
    (e = window.intlTelInput(document.querySelector("#webinar_pnumber"), {
      initialCountry: "auto",
      geoIpLookup: function (e) {
        $.get(
          "https://get.geojs.io/v1/ip/country.json",
          function () { },
          "json"
        ).always(function (t) {
          var a = t && t.country ? t.country : "us";
          e(a);
        });
      },
      hiddenInput: "full",
      utilsScript:
        "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js",
    })),
    $(".btn-back-to-step1").click(function (e) {
      $(".webinar__registration-form1").show(),
        $(".webinar__registration-success").hide(),
        $(".webinar__registration-form1-block").show(),
        $(".webinar__registration-form2-block").hide();
    }),
    $(".bc__btn-newsletter-subscription").click(function (e) {
      e.preventDefault(), setHiddenFields();
      $(".email").keypress(function () {
        $(".email-id-error").addClass("hide");
      }),
        $(".email").focus(function () {
          $(".email-id-error").addClass("hide");
        }),
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
          $(".email").val()
        ) && 0 != $(".email").val().length
          ? ($(".wr__emailid").val($(".email").val()),
            s("https://hooks.zapier.com/hooks/catch/11068981/3tvfocs/"),
            $(".webinar__loadingbar").css("display", "flex"),
            $(".newsletter-subscription-form1").submit(),
            $(".newsletter-form-step1").hide(),
            setTimeout(function () {
              $(".webinar__registration-form1-block").show(),
                $(".webinar__loadingbar").hide();
            }, 200))
          : $(".email-id-error").removeClass("hide");
    }),
    $(".bc__btn-select-webinar-slot-newsletter").click(function (t) {
      t.preventDefault(), setHiddenFields();
      let a = "";
      if (typeof intlTelInputUtils == "undefined") {
        try {
          a = `+${e.getSelectedCountryData().dialCode}${$(
            "#webinar_pnumber"
          ).val()}`;
        } catch (error) {
          a = $("#webinar_pnumber")?.val();
        }
      } else {
        a = e.getNumber(intlTelInputUtils.numberFormat.E164);
      }
      $("input[name='phone_number[intphone_full]'").val(a),
        $(".tno1").val(a),
        $(".first-name, .last-name, .phone").keypress(function () {
          $(".first-name-error, .last-name-error,.phone-error").addClass(
            "hide"
          );
        }),
        $(".first-name, .last-name, .phone").focus(function () {
          $(".first-name-error, .last-name-error,.phone-error").addClass(
            "hide"
          );
        });
      let n = new RegExp("^[a-zA-Z ]+$");
      0 == $(".first-name").val().length &&
        0 == $(".last-name").val().length &&
        0 == $(".phone").val().length
        ? $(".first-name-error, .last-name-error,.phone-error").removeClass(
          "hide"
        )
        : n.test($(".first-name").val()) && 0 != $(".first-name").val().length
          ? n.test($(".last-name").val()) && 0 != $(".last-name").val().length
            ? /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm.test(
              $(".phone").val()
            ) && 0 != $(".phone").val().length
              ? ($(".webinar__loadingbar").css("display", "flex"),
                $(".wr__firstname").val($(".first-name").val()),
                $(".wr__lastname").val($(".last-name").val()),
                $(".wr__email").val($(".email").val()),
                $(".wr__phone").val(a),
                dataLayer.push({
                  event: "new_webinar_registration_form_submitted",
                  webinar_name: document.querySelector(".webinar__lightbox-title")
                    .innerHTML,
                }),
                "On Scroll" == $(".is_exit_intent_popup").val() &&
                dataLayer.push({
                  event: "exit_intent",
                  eventCategory: "exit_intent_scroll",
                  eventAction: "exit_intent_scroll",
                  eventLabel: "form submitted",
                }),
                "Browser Tab" == $(".is_exit_intent_popup").val() &&
                dataLayer.push({
                  event: "exit_intent",
                  eventCategory: "exit_intent_browser_tab_close_gesture",
                  eventAction: "exit_intent_browser_tab_close_gesture",
                  eventLabel: "form submitted",
                }),
                s("https://hooks.zapier.com/hooks/catch/11068981/340hd4j/"),
                $(".webinar__registration-form1").submit(),
                $(".webinar__registration-form1-block").hide(),
                setTimeout(function () {
                  $(".webinar__registration-form2-block").show(),
                    $(".webinar__loadingbar").hide();
                }, 200))
              : $(".phone-error").removeClass("hide")
            : $(".last-name-error").removeClass("hide")
          : $(".first-name-error").removeClass("hide"),
        $("input:radio[name='start-date']:first").attr("checked", !0),
        $(".wr__event-start-time").val(
          $("input:radio[name='start-date']:first").val()
        ),
        $(".wr__event-end-time").val(
          $("input:radio[name='start-date']:first").data("endtime")
        ),
        $(".wr__invitee-start-time").val(
          $("input:radio[name='start-date']:first").data("invitee_starttime")
        ),
        $(".wr__invitee-end-time").val(
          $("input:radio[name='start-date']:first").data("invitee_endtime")
        ),
        $(".webinar-lead-type").val(
          $("input:radio[name='start-date']:first").data("webinar_lead_type")
        );
    }),
    $(".bc__btn-select-webinar-slot").click(function (event) {
      event.preventDefault();
      setHiddenFields();
      
      try {
        if(typeof(hasCaptcha) !== "undefined" && hasCaptcha){
          if($("#captcha")?.val() != "W9H5K") {
            $(".captcha-error").removeClass("hide")
            return;
          } else {
            $(".captcha-error").addClass("hide")
          }
        }
      } catch (error) {
        console.error(error)
      }

      paRegisteredCookie();

      let phoneNumber = "";
      if (typeof intlTelInputUtils == "undefined") {
        try {
          phoneNumber = `+${e.getSelectedCountryData().dialCode}${$(
            "#webinar_pnumber"
          ).val()}`;
        } catch (error) {
          phoneNumber = $("#webinar_pnumber")?.val();
        }
      } else {
        phoneNumber = e.getNumber(intlTelInputUtils.numberFormat.E164);
      }
      $("input[name='phone_number[intphone_full]'").val(phoneNumber);
      $(".tno1").val(phoneNumber);

      let namePattern = new RegExp("^[a-zA-Z ]+$");

      if (
        !(
          namePattern.test($(".last-name").val()) &&
          $(".last-name").val().length != 0
        )
      ) {
        $(".last-name").val($(".first-name").val());
      }

      $(".first-name, .last-name, .full-name, .phone, .email").keypress(
        function () {
          $(
            ".first-name-error, .full-name-error, .last-name-error, .email-id-error, .phone-error"
          ).addClass("hide");
        }
      );

      $(".first-name, .last-name, .full-name, .phone, .email").focus(
        function () {
          $(
            ".first-name-error, .full-name-error, .last-name-error, .email-id-error, .phone-error"
          ).addClass("hide");
        }
      );

      if (
        $(".first-name").val().length == 0 &&
        $(".email").val().length == 0 &&
        $(".phone").val().length == 0
      ) {
        $(
          ".first-name-error, .full-name-error, .last-name-error, .email-id-error, .phone-error"
        ).removeClass("hide");
      } else if (
        namePattern.test($(".first-name").val()) &&
        $(".first-name").val().length != 0
      ) {
        if (
          /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm.test(
            $(".phone").val()
          ) &&
          $(".phone").val().length != 0
        ) {
          if (
            /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
              $(".email").val()
            ) &&
            $(".email").val().length != 0
          ) {
            $(".webinar__loadingbar").css("display", "flex");
            $(".wr__firstname").val($(".first-name").val());
            $(".wr__lastname").val($(".last-name").val());
            $(".wr__email").val($(".email").val());
            $(".wr__phone").val(phoneNumber);

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

            if (is_webinar_1o1_eligible) {
              $(".webinar-lead-type").val("ONE_TO_ONE_CONNECT");
            }

            s("https://hooks.zapier.com/hooks/catch/11068981/340hd4j/");
            $(".webinar__registration-form1").submit();
            $(".webinar__registration-form1-block").hide();

            setTimeout(function () {
              $(".webinar__registration-form2-block").show();
              $(".webinar__loadingbar").hide();
            }, 200);
          } else {
            $(".email-id-error").removeClass("hide");
          }
        } else {
          $(".phone-error").removeClass("hide");
        }
      } else {
        $(".first-name-error").removeClass("hide");
        $(".full-name-error").removeClass("hide");
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
    }),
    $(".bc__btn-select-webinar-slot-upsight1").click(function (t) {
      t.preventDefault();
      setHiddenFields();
      $(".wr__event-start-time").val(
        $(".webinar-event-date").attr("data-starttime")
      );
      $(".wr__event-end-time").val(
        $(".webinar-event-date").attr("data-endtime")
      );

      $(".wr__invitee-start-time").val(
        $(".webinar-event-date").attr("data-invitee_starttime")
      );
      $(".wr__invitee-end-time").val(
        $(".webinar-event-date").attr("data-invitee_endtime")
      );
      $(".webinar-lead-type").val(
        $(".webinar-event-date").attr("data-webinar_lead_type")
      );
      let a = "";
      if (typeof intlTelInputUtils == "undefined") {
        try {
          a = `+${e.getSelectedCountryData().dialCode}${$(
            "#webinar_pnumber"
          ).val()}`;
        } catch (error) {
          a = $("#webinar_pnumber")?.val();
        }
      } else {
        a = e.getNumber(intlTelInputUtils.numberFormat.E164);
      }

      $("input[name='phone_number[intphone_full]'").val(a);
      $(".tno1").val(a);

      $(".first-name, .last-name, .phone, .email").keypress(function () {
        $(
          ".first-name-error, .last-name-error, .email-id-error, .phone-error"
        ).addClass("hide");
      });

      $(".first-name, .last-name, .phone, .email").focus(function () {
        $(
          ".first-name-error, .last-name-error, .email-id-error, .phone-error"
        ).addClass("hide");
      });
      let name_regex = new RegExp("^[a-zA-Z ]+$");
      let email_regex =
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      let phone_regex =
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

      if (
        0 == $(".first-name").val().length &&
        0 == $(".last-name").val().length &&
        0 == $(".email").val().length &&
        0 == $(".phone").val().length
      ) {
        $(
          ".first-name-error, .last-name-error, .email-id-error, .phone-error"
        ).removeClass("hide");
      } else if (
        !name_regex.test($(".first-name").val()) ||
        $(".first-name").val().length == 0
      ) {
        $(".first-name-error").removeClass("hide");
      } else if (
        !name_regex.test($(".last-name").val()) ||
        $(".last-name").val().length == 0
      ) {
        $(".last-name-error").removeClass("hide");
      } else if (
        !phone_regex.test($(".phone").val()) ||
        $(".phone").val().length == 0
      ) {
        $(".phone-error").removeClass("hide");
      } else if (
        !email_regex.test($(".email").val()) ||
        $(".email").val().length == 0
      ) {
        $(".email-id-error").removeClass("hide");
      } else {
        $(".wr__firstname").val($(".first-name").val());
        $(".wr__lastname").val($(".last-name").val());
        $(".wr__email").val($(".email").val());
        $(".wr__phone").val(a);
        t = $(".webinar-event-date").attr("data-starttime");
        a = $(".webinar-event-date").data("endtime");
        n = visitor_id + ":" + v_country;
        i =
          v_timezone +
          ":learn.ik" +
          cta_lp +
          ":learn.ik" +
          getCookie("ik-landingpage-v2");
        // r = "?utm_source=" + $(".utm_source").val() + "&webinarType=" + webinarType + "&event=" + eventName + "&invitee_last_name=" + "&event_start_time=" + t + "&invitee_first_name=" + $(".wr__firstname").val() + $(".wr__lastname").val() + "&invitee_email=" + $(".wr__email").val() + "&answer_1=" + $(".wr__phone").val() + "&utm_medium=" + n + "&salesforce_uuid=" + i;
        r =
          "?utm_source=" +
          $(".utm_source").val() +
          "&webinarType=" +
          webinarType +
          "&event=" +
          eventName +
          "&event_start_time=" +
          t +
          "&utm_medium=" +
          n +
          "&salesforce_uuid=" +
          i;
        var redirectUrl = getLearnGQLLink() + r;
        gqlFormCookieData();
        dataLayer.push({
          event: "new_webinar_registration_form_submitted",
          webinar_name: document.querySelector(".webinar__lightbox-title")
            .innerHTML,
        });
        if ("On Scroll" == $(".is_exit_intent_popup").val()) {
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_scroll",
            eventAction: "exit_intent_scroll",
            eventLabel: "form submitted",
          });
        }
        if ("Browser Tab" == $(".is_exit_intent_popup").val()) {
          dataLayer.push({
            event: "exit_intent",
            eventCategory: "exit_intent_browser_tab_close_gesture",
            eventAction: "exit_intent_browser_tab_close_gesture",
            eventLabel: "form submitted",
          });
        }
        $(".webinar__loadingbar").css("display", "flex");
        s("https://hooks.zapier.com/hooks/catch/11068981/3qesn6w/");

        bake_cookie("v_history", "");
        bake_cookie("v_latest", "");

        $(".webinar__registration-form1").submit();
        $(".webinar__registration-form1-block").hide();

        if (1 != singlesignup) {
          setTimeout(function () {
            location.href = redirectUrl;
          }, 800);
        } else {
          $(".webinar__loadingbar").hide();
          $(".webinar__registration-form1-block").hide();
        }
      }
    }),
    $(".bc__btn-select-webinar-slot-v2").click(function (t) {
      t.preventDefault(), setHiddenFields();
      let a = "";
      if (typeof intlTelInputUtils == "undefined") {
        try {
          a = `+${e.getSelectedCountryData().dialCode}${$(
            "#webinar_pnumber"
          ).val()}`;
        } catch (error) {
          a = $("#webinar_pnumber")?.val();
        }
      } else {
        a = e.getNumber(intlTelInputUtils.numberFormat.E164);
      }

      $("input[name='phone_number[intphone_full]'").val(a),
        $(".tno1").val(a),
        $(".full-name,.email,.phone").keypress(function () {
          $(".full-name-error,.email-id-error,.phone-error").addClass("hide");
        }),
        $(".full-name, .email, .phone").focus(function () {
          $(".full-name-error,.email-id-error,.phone-error").addClass("hide");
        });
      let n = new RegExp("^[a-zA-Z ]+$");
      if (
        0 == $(".full-name").val().length &&
        0 == $(".email").val().length &&
        0 == $(".phone").val().length
      )
        $(".full-name-error,.email-id-error,.phone-error").removeClass("hide");
      else if (
        n.test($(".full-name").val()) &&
        0 != $(".full-name").val().length
      )
        if (
          /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm.test(
            $(".phone").val()
          ) &&
          0 != $(".phone").val().length
        )
          if (
            /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
              $(".email").val()
            ) &&
            0 != $(".email").val().length
          ) {
            $(".webinar__loadingbar").css("display", "flex");
            let e = $(".full-name").val();
            "" == e.substring(0, e.indexOf(" "))
              ? ($(".wr__firstname").val(e.substring(e.indexOf(" ") + 1)),
                $(".wr__lastname").val("IK"))
              : "" == e.substring(e.indexOf(" ") + 1)
                ? ($(".wr__firstname").val(e.substring(0, e.indexOf(" "))),
                  $(".wr__lastname").val(e.substring(0, e.indexOf(" "))))
                : ($(".wr__firstname").val(e.substring(0, e.indexOf(" "))),
                  $(".wr__lastname").val(e.substring(e.indexOf(" ") + 1))),
              $(".wr__email").val($(".email").val()),
              $(".wr__phone").val(a),
              dataLayer.push({
                event: "new_webinar_registration_form_submitted",
                webinar_name: document.querySelector(".webinar__lightbox-title")
                  .innerHTML,
              }),
              "On Scroll" == $(".is_exit_intent_popup").val() &&
              dataLayer.push({
                event: "exit_intent",
                eventCategory: "exit_intent_scroll",
                eventAction: "exit_intent_scroll",
                eventLabel: "form submitted",
              }),
              "Browser Tab" == $(".is_exit_intent_popup").val() &&
              dataLayer.push({
                event: "exit_intent",
                eventCategory: "exit_intent_browser_tab_close_gesture",
                eventAction: "exit_intent_browser_tab_close_gesture",
                eventLabel: "form submitted",
              }),
              s("https://hooks.zapier.com/hooks/catch/11068981/340hd4j/"),
              $(".webinar__registration-form1").submit(),
              $(".webinar__registration-form1-block").hide(),
              setTimeout(function () {
                $(".webinar__registration-form2-block").show(),
                  $(".webinar__loadingbar").hide();
              }, 200);
          } else $(".email-id-error").removeClass("hide");
        else $(".phone-error").removeClass("hide");
      else $(".full-name-error").removeClass("hide");
      $("input:radio[name='start-date']:first").attr("checked", !0),
        $(".wr__event-start-time").val(
          $("input:radio[name='start-date']:first").val()
        ),
        $(".wr__event-end-time").val(
          $("input:radio[name='start-date']:first").data("endtime")
        ),
        $(".wr__invitee-start-time").val(
          $("input:radio[name='start-date']:first").data("invitee_starttime")
        ),
        $(".wr__invitee-end-time").val(
          $("input:radio[name='start-date']:first").data("invitee_endtime")
        ),
        $(".webinar-lead-type").val(
          $("input:radio[name='start-date']:first").data("webinar_lead_type")
        );
    }),
    $(".bc__upworth-next").click(function (e) {
      e.preventDefault();
      let t = $(".gql-exp-select").val(),
        a = $(".gql-domain-select").val();
      "" == t
        ? $(".work-exp-error").removeClass("hide")
        : "" == a
          ? $(".domain-error").removeClass("hide")
          : ($(".gql-work-experience").val(t),
            $(".gql-role-domain").val(a),
            $(".webinar__registration-form1-block-s1").hide(),
            $(".webinar__registration-form1-block-s2").show());
    }),
    $(".bc__upworth-step2").click(function (t) {
      t.preventDefault(), setHiddenFields();
      let a = $(".gql-exp-select").val(),
        n = $(".gql-domain-select").val();
      let i = "";
      if (typeof intlTelInputUtils == "undefined") {
        try {
          i = `+${e.getSelectedCountryData().dialCode}${$(
            "#webinar_pnumber"
          ).val()}`;
        } catch (error) {
          i = $("#webinar_pnumber")?.val();
        }
      } else {
        i = e.getNumber(intlTelInputUtils.numberFormat.E164);
      }
      $("input[name='phone_number[intphone_full]'").val(i),
        $(".tno1").val(i),
        $(".first-name, .last-name, .phone, .email").keypress(function () {
          $(
            ".first-name-error, .last-name-error,.email-id-error,.phone-error"
          ).addClass("hide");
        }),
        $(".first-name, .last-name, .phone, .email").focus(function () {
          $(
            ".first-name-error, .last-name-error,.email-id-error,.phone-error"
          ).addClass("hide");
        });
      let r = new RegExp("^[a-zA-Z ]+$");
      0 == $(".first-name").val().length &&
        0 == $(".last-name").val().length &&
        0 == $(".email").val().length &&
        0 == $(".phone").val().length
        ? $(
          ".first-name-error, .last-name-error,.email-id-error,.phone-error"
        ).removeClass("hide")
        : r.test($(".first-name").val()) && 0 != $(".first-name").val().length
          ? r.test($(".last-name").val()) && 0 != $(".last-name").val().length
            ? /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm.test(
              $(".phone").val()
            ) && 0 != $(".phone").val().length
              ? /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
                $(".email").val()
              ) && 0 != $(".email").val().length
                ? ($(".webinar__loadingbar").css("display", "flex"),
                  dataLayer.push({
                    event: "new_webinar_registration_form_submitted",
                    webinar_name: document.querySelector(
                      ".webinar__lightbox-title"
                    ).innerHTML,
                  }),
                  s("https://hooks.zapier.com/hooks/catch/11068981/3hp515j/"),
                  $(".profile-analysis-step1").submit(),
                  setTimeout(function () {
                    location.href =
                      "/upworth" +
                      window.location.search +
                      "&domain=" +
                      n +
                      "&workexp=" +
                      a +
                      "&email=" +
                      $(".email").val() +
                      "&fname=" +
                      $(".first-name").val() +
                      "&lname=" +
                      $(".last-name").val() +
                      "&phone=" +
                      $(".phone").val();
                  }, 200))
                : $(".email-id-error").removeClass("hide")
              : $(".phone-error").removeClass("hide")
            : $(".last-name-error").removeClass("hide")
          : $(".first-name-error").removeClass("hide");
    }),
    $(".bc__btn-2nd-step").click(function (e) {
      try {
        saveClickActivity($(this).attr("id"), new Date().getTime());
        window.VWO = window.VWO || [];
        VWO.event =
          VWO.event ||
          function () {
            VWO.push(["event"].concat([].slice.call(arguments)));
          };
        VWO.event("gqlFormCompleted", {
          gqlFormCompleted: true,
        });
      } catch (e) {
        console.error(e);
      }
      if (
        (e.preventDefault(), $("input:radio[name='start-date']").is(":checked"))
      ) {
        paRegisteredCookie();
        let e,
          t = $('input[name="start-date"]:checked').val(),
          a = $('input[name="start-date"]:checked').data("endtime"),
          n = visitor_id + ":" + v_country,
          i =
            v_timezone +
            ":learn.ik" +
            cta_lp +
            ":learn.ik" +
            getCookie("ik-landingpage-v2"),
          r =
            "?utm_source=" +
            $(".utm_source").val() +
            "&assigned_to=Interview Kickstart&invitee_first_name=" +
            $(".wr__firstname").val() +
            "&invitee_last_name=" +
            $(".wr__lastname").val() +
            "&invitee_email=" +
            $(".wr__email").val() +
            "&answer_1=" +
            $(".wr__phone").val() +
            "&event_start_time=" +
            t +
            "&event_end_time=" +
            a +
            "&utm_medium=" +
            n +
            "&salesforce_uuid=" +
            i;

        var newUrl = "https://learn.interviewkickstart.com/home-v16";

        if (window.location.href == newUrl) {
          (d =
            "NoPhoneInTheFirstStep" == $(".bye-calendly-type").val()
              ? "https://www.interviewkickstart.com/signup-final-step-v6" + r
              : "https://www.interviewkickstart.com/signup-final-step-v9" +
              "?utm_source=" +
              $(".utm_source").val() +
              "&utm_medium=" +
              n +
              "&salesforce_uuid=" +
              i),
            $(".wr__event-start-time").val(t),
            $(".wr__event-end-time").val(a),
            $(".wr__invitee-start-time").val(
              $("input[name='start-date']:checked").data("invitee_starttime")
            ),
            $(".wr__invitee-end-time").val(
              $("input[name='start-date']:checked").data("invitee_endtime")
            ),
            $(".webinar-lead-type").val(
              $("input[name='start-date']:checked").data("webinar_lead_type")
            ),
            $(".webinar__loadingbar").show(),
            s("https://hooks.zapier.com/hooks/catch/14138759/3w3s428/"),
            $(".webinar__registration-form2").submit(),
            bake_cookie("v_history", ""),
            bake_cookie("v_latest", ""),
            1 != singlesignup
              ? (() => {
                try {
                  saveClickActivity(
                    "Webinar-modal_button_open-gql",
                    new Date().getTime(),
                    () => {
                      location.href = d;
                    }
                  );
                } catch (error) {
                  setTimeout(function () {
                    location.href = d;
                  }, 800);
                }
              })()
              : ($(".webinar__loadingbar").hide(),
                $(".webinar__registration-form2-block").hide(),
                $(".webinar__registration-form3-block").show());
        } else if (typeof paRegistered !== "undefined") {
          (d =
            "NoPhoneInTheFirstStep" == $(".bye-calendly-type").val()
              ? "https://www.interviewkickstart.com/signup-final-step-v6" + r
              : getLearnGQLLink() +
              "?utm_source=" +
              $(".utm_source").val() +
              "&utm_medium=" +
              $(".wr__email").val() +
              "&salesforce_uuid=" +
              i),
            $(".wr__event-start-time").val(t),
            $(".wr__event-end-time").val(a),
            $(".wr__invitee-start-time").val(
              $("input[name='start-date']:checked").data("invitee_starttime")
            ),
            $(".wr__invitee-end-time").val(
              $("input[name='start-date']:checked").data("invitee_endtime")
            ),
            $(".webinar-lead-type").val(
              $("input[name='start-date']:checked").data("webinar_lead_type")
            ),
            $(".webinar__loadingbar").show(),
            s("https://hooks.zapier.com/hooks/catch/11068981/307qti9/"),
            $(".webinar__registration-form2").submit(),
            bake_cookie("v_history", ""),
            bake_cookie("v_latest", ""),
            1 != singlesignup
              ? (() => {
                try {
                  saveClickActivity(
                    "Webinar-modal_button_open-gql",
                    new Date().getTime(),
                    () => {
                      location.href = d;
                    }
                  );
                } catch (error) {
                  setTimeout(function () {
                    location.href = d;
                  }, 800);
                }
              })()
              : ($(".webinar__loadingbar").hide(),
                $(".webinar__registration-form2-block").hide(),
                $(".webinar__registration-form3-block").show());
        } else {
          new Promise(async (resolve, reject) => {
            if (is_webinar_1o1_eligible) {
              const url =
                "https://uplevel.interviewkickstart.com/api/v1/webinar_connect/book-slot/";
              const payload = {
                slot_id: parseInt(
                  $('input[name="start-date"]:checked').data("slotid")
                ),
                email: $(".email").val(),
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
          })
            .then((resData) => {
              (e =
                "NoPhoneInTheFirstStep" == $(".bye-calendly-type").val()
                  ? "https://www.interviewkickstart.com/signup-final-step-v6" +
                  r
                  : getLearnGQLLink() +
                  "?utm_source=" +
                  $(".utm_source").val() +
                  "&utm_medium=" +
                  n +
                  "&salesforce_uuid=" +
                  i),
                $(".wr__event-start-time").val(t),
                $(".wr__event-end-time").val(a),
                $(".wr__invitee-start-time").val(
                  $("input[name='start-date']:checked").data(
                    "invitee_starttime"
                  )
                ),
                $(".wr__invitee-end-time").val(
                  $("input[name='start-date']:checked").data("invitee_endtime")
                ),
                $(".webinar-lead-type").val(
                  $("input[name='start-date']:checked").data(
                    "webinar_lead_type"
                  )
                ),
                $(".webinar-type").val($(".webinar-type").val()),
                $(".webinar__loadingbar").show(),
                is_webinar_1o1_eligible
                  ? s("https://hooks.zapier.com/hooks/catch/11068981/2dvpcc1/")
                  : s("https://hooks.zapier.com/hooks/catch/11068981/340hl1a/"),
                $(".webinar__registration-form2").submit(),
                bake_cookie("v_history", ""),
                bake_cookie("v_latest", ""),
                1 != singlesignup
                  ? (() => {
                    try {
                      saveClickActivity(
                        "Webinar-modal_button_open-gql",
                        new Date().getTime(),
                        () => {
                          location.href = e;
                        }
                      );
                    } catch (error) {
                      setTimeout(function () {
                        location.href = e;
                      }, 800);
                    }
                  })()
                  : ($(".webinar__loadingbar").hide(),
                    $(".webinar__registration-form2-block").hide(),
                    $(".webinar__registration-form3-block").show());
            })
            .catch((error) => {
              console.error(error);
              $(".webinar__loadingbar").hide();
              $(".webinar__registration-form2-block").hide();
            });
        }
      }
      gqlFormCookieData();

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
          data: [
            {
              Lead_Created_Time: LeadCreatedTime,
              Lead_Name:
                $(".wr__firstname").val() + " " + $(".wr__lastname").val(),
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
              User_Agent: encodeURIComponent(navigator?.userAgent || ""),
              Refferer: encodeURIComponent($(".wr__referrer").val()),
              Region: $(".wr__region").val(),
            },
          ],
        }),
        success: function (e) {
          console.log("Success Response:", e);
        },
        error: function (xhr, status, error) {
          console.log("Error Response:", xhr.responseText);
          console.log("Status:", status);
          console.log("Error:", error);
        },
      });
    });
  //lead LeadCreatedTime
  const currentDateTime = new Date();
  //const LeadCreatedTime = currentDateTime.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, ' UTC');
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
        console.log("Success Response:", e);
        console.log("Click_history-data:", data1);
      },
      error: function (xhr, status, error) {
        console.log("Error Response:", xhr.responseText);
        console.log("Status:", status);
        console.log("Error:", error);
      },
    });
  }, "3000");

  //Whenever we click the button the api call happens and the webinar type is set.
  $('input[name="webinar-type"]').change(function () {
    let webinarType1 = $("input[name='webinar-type']:checked").attr(
      "webinar-type"
    );
    $(".webinar-type").val(webinarType1);
    localStorage.setItem("WebinarType1", webinarType1);
    $("html, body").animate({ scrollTop: 0 }, "slow");
    setTimeout(() => {
      $(".webinar__slots").empty();
      createWebinarSlot(webinarType1);
    }, 2000);
    if (webinarType1 == "SWITCH_UP") {
      $(".webinar__lightbox-title").text(
        "Uplevel your career with AI/ML/GenAI"
      );
      $('input[name="Event Name"]').val("Uplevel your career with AI/ML/GenAI");
    } else if (webinarType1 == "REGULAR" || webinarType1 == undefined) {
      $(".webinar__lightbox-title").text(
        "How to Nail your next Technical Interview"
      );
      $('input[name="Event Name"]').val(
        "How to Nail your next Technical Interview"
      );
    }
  });

  //Set GQL form cookies Data
  function gqlFormCookieData() {
    const previousData = {
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
    var jsonData = JSON.stringify(previousData);
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
      if (isDev()) {
        document.cookie =
          cookieName +
          "=" +
          cookieValue +
          "; expires=" +
          expirationTime +
          "; path=/; domain=iklearn.webflow.io";
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
  }
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
    const timezoneDisplay = $(".webinar__slots #timezone");

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
    Object.keys(times)
      .sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a}:00`).getTime();
        const timeB = new Date(`1970-01-01T${b}:00`).getTime();
        return timeA - timeB;
      })
      .forEach((time, index) => {
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
              timeZone: localTimeZone, // Set the time zone to IST
            }) +
            " - " +
            startDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: localTimeZone, // Set the time zone to IST
            });

          const inviteeEndTime =
            endDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: localTimeZone, // Set the time zone to IST
            }) +
            " - " +
            endDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: localTimeZone, // Set the time zone to IST
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
