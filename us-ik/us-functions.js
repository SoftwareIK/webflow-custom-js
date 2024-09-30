//https://cdn.jsdelivr.net/gh/kothinti/ik/us-functions.v1.6.3.min.js
function isCookieSizeExceeded() {
  let c_size = 15;
  var h_cookie = read_cookie("v_history");

  if (h_cookie == null) return;

  if (h_cookie.length >= c_size) {
    h_cookie.shift();
    bake_cookie("v_history", h_cookie);
  }
}

function isDuplicateCookie(utm_params, recent_visit) {
  if (
    utm_params["utm_source"] == recent_visit["utm_source"] &&
    utm_params["utm_medium"] == recent_visit["utm_medium"] &&
    utm_params["utm_campaign"] == recent_visit["utm_campaign"] &&
    utm_params["utm_adset"] == recent_visit["utm_adset"] &&
    utm_params["utm_content"] == recent_visit["utm_content"] &&
    utm_params["utm_term"] == recent_visit["utm_term"] &&
    utm_params["fbclid"] == recent_visit["fbclid"]
  ) {
    return true;
  } else {
    return false;
  }
}

function bake_cookie_history(name, value) {
  isCookieSizeExceeded();

  var visits_history = [];
  var iksutmhistory = read_cookie(name);

  var utmstring = value;
  utmstring.timestamp = $.now();
  utmstring.ip = v_ip;
  utmstring.region = v_region;
  utmstring.landing_page = window.location.pathname;
  utmstring.userAgent = encodeURIComponent(navigator.userAgent);
  utmstring.city = v_city;
  utmstring.device = getDeviceType();
  utmstring.visitor_id = visitor_id;
  utmstring.referrer = referrer;
  value = utmstring;

  if (iksutmhistory == "" || iksutmhistory == null) {
    visits_history.push(utmstring);

    var cookie = [
      name,
      "=",
      JSON.stringify(visits_history),
      ";expires",
      "=",
      expdate.toGMTString(),
      "; domain=.",
      window.location.host.toString(),
      "; path=/;",
    ].join("");
    document.cookie = cookie;
  } else {
    var result = document.cookie.match(new RegExp(name + "=([^;]+)"));
    result && (result = JSON.parse(result[1]));

    var newhistoryobj = result.push(value);

    var cookie = [
      name,
      "=",
      JSON.stringify(result),
      ";expires",
      "=",
      expdate.toGMTString(),
      "; domain=.",
      window.location.host.toString(),
      "; path=/;",
    ].join("");
    document.cookie = cookie;
  }
}

function bake_organic_cookie() {
  var organicobj = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_adset: "",
    utm_content: "",
    utm_term: "",
    timestamp: $.now(),
    ip: v_ip,
    region: v_region,
    landing_page: window.location.pathname,
    userAgent: encodeURIComponent(navigator.userAgent),
    city: v_city,
    device: getDeviceType(),
    visitor_id: visitor_id,
    referrer: referrer,
  };

  if (
    referrer == null ||
    referrer.indexOf(window.location.host.toString()) == -1
  ) {
    bake_cookie_history("v_history", organicobj);
    bake_cookie("v_latest", organicobj);
  }
}

function bake_cookie(name, value) {
  var utmstring = value;
  utmstring.timestamp = $.now();
  utmstring.ip = v_ip;
  utmstring.region = v_region;
  utmstring.landing_page = window.location.pathname;
  utmstring.userAgent = encodeURIComponent(navigator.userAgent);
  utmstring.city = v_city;
  utmstring.device = getDeviceType();
  utmstring.visitor_id = visitor_id;
  utmstring.referrer = referrer;

  var cookie = [
    name,
    "=",
    JSON.stringify(utmstring),
    ";expires",
    "=",
    expdate.toGMTString(),
    "; domain=.",
    window.location.host.toString(),
    "; path=/;",
  ].join("");
  document.cookie = cookie;
}

function read_cookie(name) {
  var result = document.cookie.match(new RegExp(name + "=([^;]+)"));
  result && (result = JSON.parse(result[1]));
  return result;
}

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function showCalendly(cv) {
  var curl =
    generateCalendlyLink("calendly", cv) + "&hide_event_type_details=1";
  Calendly.initPopupWidget({
    url: curl,
  });
}

$(".request-info-close").click(function (e) {
  $(".request-info-wrap").css("display", "none");
  $(".request-info-wrap").css("opacity", 0);
});

function generateCalendlyLink(platform, cv) {
  var calendlyurl;

  if (platform == "hubspot") {
    calendlyurl = "https://meetings.hubspot.com/ik/admissions?embed=true&";
  } else {
    if (cv == "v2") {
      calendlyurl =
        "https://calendly.com/team-ik/how-to-nail-your-next-interview-dsw?";
    } else {
      calendlyurl =
        "https://calendly.com/interviewkickstart/enrollment-workshop?";
    }
  }

  var active_visit = read_cookie("v_latest");
  var visit_history = read_cookie("v_history");
  var gaid = getCookie("_ga");
  visitor_id = visitor_id + gaid;

  var utm_medium_str = "utm_medium=";

  for (const property in active_visit) {
    if (`${property}` == "utm_medium") {
      utm_medium_str = utm_medium_str + `${active_visit[property]}`;
    }
  }

  utm_medium_str = utm_medium_str + ":";

  for (const property in active_visit) {
    if (`${property}` == "gclid") {
      utm_medium_str = utm_medium_str + "gclid:" + `${active_visit[property]}`;
    } else if (`${property}` == "msclkid") {
      utm_medium_str =
        utm_medium_str + "msclkid:" + `${active_visit[property]}`;
    } else if (`${property}` == "fbclid") {
      utm_medium_str = utm_medium_str + "fbclid:" + `${active_visit[property]}`;
    }
  }

  if (
    utm_medium_str.indexOf("gclid") == -1 &&
    utm_medium_str.indexOf("msclkid") == -1 &&
    utm_medium_str.indexOf("fbclid") == -1
  ) {
    utm_medium_str = utm_medium_str + ":";
  }

  utm_medium_str = utm_medium_str + ":" + visitor_id;
  utm_medium_str = utm_medium_str + ":" + v_country;

  for (const property in active_visit) {
    var ptyn = `${active_visit[property]}`;

    if (
      `${property}` != "utm_medium" &&
      `${property}` != "msclkid" &&
      `${property}` != "fbclid" &&
      `${property}` != "gclid"
    ) {
      calendlyurl =
        calendlyurl + `${property}` + "=" + `${active_visit[property]}` + "&";
    }
  }

  utm_medium_str =
    utm_medium_str +
    "&salesforce_uuid=" +
    v_timezone +
    ":ik.com" +
    cta_lp +
    ":ik.com" +
    getCookie("ik-landingpage-v2");

  calendlyurl = calendlyurl + utm_medium_str;
  return calendlyurl;
}

function setHiddenFields() {
  let params = read_cookie("v_latest");
  let fUSWFlag = getAllUrlParams();

  if (fUSWFlag["forceuswebinar"] == "true") {
    $(".v_country").val("United States");
    $(".user_timezone").val("US/Pacific");
    v_timezone = "US/Pacific";
    v_country = "United States";
  } else {
    $(".v_country").val(v_country);
    $(".user_timezone").val(v_timezone);
  }

  $(".utm_source").val(
    decodeURIComponent(
      params?.utm_source != undefined ? params["utm_source"] : "Organic"
    )
  );
  $(".utm_medium").val(
    decodeURIComponent(
      params?.utm_medium != undefined ? params["utm_medium"] : ""
    )
  );
  $(".utm_campaign").val(
    decodeURIComponent(
      params?.utm_campaign != undefined ? params["utm_campaign"] : ""
    )
  );
  $(".utm_adset").val(
    decodeURIComponent(
      params?.utm_adset != undefined ? params["utm_adset"] : ""
    )
  );
  $(".utm_content").val(
    decodeURIComponent(
      params?.utm_content != undefined ? params["utm_content"] : ""
    )
  );
  $(".utm_term").val(
    decodeURIComponent(params?.utm_term != undefined ? params["utm_term"] : "")
  );

  $(".page_url").val(window.location.href);
  // $('.webinar-type').val(((webinarType == undefined) || (webinarType == "REGULAR")) ? "REGULAR" : "SWITCH_UP");
  switch (webinarType) {
    case undefined:
    case "REGULAR":
      webinarTypeValue = "REGULAR";
      break;
    case "Product Management":
      webinarTypeValue = "Product Management";
      break;
    default:
      webinarTypeValue = "SWITCH_UP";
      break;
  }
  $(".webinar-type").val(webinarTypeValue);

  $(".user_id").val(visitor_id);
  $(".gclid").val(
    decodeURIComponent(params?.gclid != undefined ? params["gclid"] : "")
  );
  $(".salesforce_uuid").val(
    decodeURIComponent(
      params?.salesforce_uuid != undefined ? params["salesforce_uuid"] : ""
    )
  );
  $(".msclkid").val(
    decodeURIComponent(params?.msclkid != undefined ? params["msclkid"] : "")
  );
  $(".fbclid").val(
    decodeURIComponent(params?.fbclid != undefined ? params["fbclid"] : "")
  );
  $(".landing_page").val("ik.com" + getCookie("ik-landingpage-v2"));
  $(".cta_page_url").val("ik.com" + cta_lp),
    $(".l_page_url").val("ik.com" + getCookie("ik-landingpage-v2"));
  $(".var_localtimezone").text(utz == undefined ? "US/Pacific" : utz);

  $(".wr__referrer").val(referrer);
  $(".wr__device").val(getDeviceType());
}

function getDeviceType() {
  var userAgent = navigator.userAgent;
  if (/mobile/i.test(userAgent)) {
    return "Mobile";
  } else if (/iPad|Android|Touch/i.test(userAgent)) {
    return "Tablet";
  } else {
    return "Desktop";
  }
}

function calendlySignup(isthisForm, formstr) {
  $(".loading-overlay").css("display", "flex");

  let calendlyurl = generateCalendlyLink();
  var visit_history = read_cookie("v_history");

  if (isthisForm) {
    calendlyurl = calendlyurl + formstr;
  }

  let page_url = window.location.pathname;
  var jsonData = {
    unique_visitor_id: visitor_id.toString().replace(/"/g, ""),
    device_name: "",
    page_url: page_url,
    visitor_city: v_city,
    click_history: JSON.stringify(visit_history),
  };

  $.ajax({
    type: "POST",
    url: "https://hooks.zapier.com/hooks/catch/9555768/ong6g6o/",
    data: jsonData,
    success: function (e) {
      if (e.status == "success") {
        bake_cookie("v_history", "");
        bake_cookie("v_latest", "");
      }
      setCookie("ik-landingpage", "");

      setTimeout(function () {
        location.href = calendlyurl;
        $(".loading-overlay").css("display", "none");
      }, 100);
    },
  });
}
