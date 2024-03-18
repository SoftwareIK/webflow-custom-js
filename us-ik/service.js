function leadScoreService(params, callback) {
  const API_KEY = "cT8YFc92uylyqfQXWMMrFdLTiMA";
  const API = "https://ajoably4nhpvq73kbzfkxmfnuu0eixdq.lambda-url.us-west-1.on.aws";
  const utmparams = params?.utmparams;

  const data = JSON.stringify({
    email: $('.invitee_email').val(),
    formatted_date: $('.event_start_time').val(),
    lead_email: $('.invitee_email').val(),
    channel: decodeURIComponent(utmparams?.['utm_source']),
    role_domain: $('.role_domain').val(),
    work_ex: $('.work_experience').val(),
    interview_start_time: $('.int_start_time').val(),
    time_zone_2: v_timezone,
    webinar_date: $('.event_start_time').val(),
    device: $(".wr__device").val(),

    leads_stats: isSwitchUp !== "No" ? "SU" : "Others",
    sale_date: null,
    alumni_stats: "New_Lead",
  });

  $.ajax({
    method: "POST",
    url: API,
    data: data,
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json'},
    success: function (res) {
      if(callback) {
        callback(res);
      }
    },
    error: function (e) {
      console.error(e)
    }
  });
}  