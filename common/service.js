/**
 * This function fetch lead score by using form data and sent response to callback function.
 * This is used in learn and organic site's GQL forms.
 * @param {object} params 
 * @param {Function} callback 
 */

function leadScoreService({ data, api }, callback) {
  const API_KEY = "cT8YFc92uylyqfQXWMMrFdLTiMA";

  const payload = JSON.stringify({
    leads_stats: isSwitchUp !== "No" ? "SU" : "Others",
    ...data
  });

  $.ajax({
    method: "POST",
    url: api,
    data: payload,
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    success: function (res) {
      if (callback) {
        callback(res);
      }
    },
    error: function (e) {
      console.error(e)
      callback();
    }
  });
}  