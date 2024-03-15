let leadScoreReponse = {};
function leadScoreService() {
  const API_KEY = "cT8YFc92uylyqfQXWMMrFdLTiMA";
  const API = "https://ajoably4nhpvq73kbzfkxmfnuu0eixdq.lambda-url.us-west-1.on.aws";
  const utmparams = getAllUrlParams();

  const data = JSON.stringify({
    email: $('.invitee_email').val(),
    formatted_date: $('.event_start_time').val(),
    lead_email: $('.invitee_email').val(),
    channel: decodeURIComponent(utmparams['utm_source']),
    role_domain: $('.role_domain').val(),
    work_ex: $('.work_experience').val(),
    interview_start_time: $('.int_start_time').val(),
    time_zone_2: v_timezone,
    webinar_date: $('.event_start_time').val(),
    device: $(".wr__device").val(),

    // TODO: confirm this.
    leads_stats: isSwitchUp ? "SU" : "Others",
    sale_date: null,
    alumni_stats: "New_Lead",
  });

  console.log("Lead score payload", data)

  $.ajax({
    method: "POST",
    url: API,
    data: data,
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json'},
    success: function (res) {
      leadScoreReponse = res;
      console.log("RES", res)
    },
    error: function (e) {
      console.log("GOT ERROR");
      console.error(e)
    }
  });
}

