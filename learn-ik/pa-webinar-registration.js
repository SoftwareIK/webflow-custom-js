$(document).ready(function () {
  const CLIENT_ID = '841321224682-obn4453m17qf0hhbupbbqbesk19ajk23.apps.googleusercontent.com';
  const REDIRECT_URI = 'https://' + window.location.hostname + '/pa-webinar-registration';
  const accessToken = getAccessTokenFromUrl();
  if (accessToken) {
    $("#singupbtn").hide();
    fetchUserInfo(accessToken);
    $(".pa-webinar-register").removeClass("disabled");
  } else {
    console.error('Access token not found in URL.');
  }
  function oauth2SignIn() {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    const params = {
      'client_id': CLIENT_ID,
      'redirect_uri': REDIRECT_URI,
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
      'state': 'try_sample_request',
      'include_granted_scopes': 'true',
      'response_type': 'token'
    };

    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', params[key]);
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
  }
  window.onload = function () {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: oauth2SignIn
    });

    google.accounts.id.renderButton(
      document.getElementById("singupbtn"), {
      theme: "filled_blue",
      size: "large",
      type: "standard",
      text: "Sign in with Google",
      width: "100%",
    });
    google.accounts.id.prompt();
  }

  // get User data form google user information using access token
  function getAccessTokenFromUrl() {
    return new URLSearchParams(window.location.hash.substring(1)).get('access_token');
  }
  function fetchUserInfo(accessToken) {
    const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';
    $.ajax({
      url: userInfoEndpoint,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: handleUserInfoResponse,
      error: handleUserInfoError
    });
  }

  function handleUserInfoResponse(response) {
    const userName = response.name;
    const welcomeDiv = $("#welcometext");
    welcomeDiv.text("Welcome " + userName + " ! ");
    welcomeDiv.append("<a id='signOutBtn' href='#'>Sign out</a>");
    $("#signOutBtn").click(function (e) {
      e.preventDefault();
      removeTokenFromUrl();
    });
    //pa-webinar-register 
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
      $(".pa-webinar-register").click(function (e) {
        e.preventDefault();

        let webinarType1 = $("input[name='webinar-type']:checked").attr("webinar-type");
        $(".webinar-type").val(webinarType1);

        $('input[name="webinar-type"]').click(function () {
          $('.pa-radio-error').addClass('hide');
        });

        const accessToken = getAccessTokenFromUrl();
        if ($('input[name="webinar-type"]:checked').length == 0 && !accessToken) {
          $('.pa-radio-error, .signin-btn-error').removeClass('hide');
        }
        else if (!accessToken) {
          $(".signin-btn-error").removeClass('hide');
          console.error('Access token not found in URL.');
        }
        else if ($('input[name="webinar-type"]:checked').length == 0) {
          $('.pa-radio-error').removeClass('hide');
        }
        else {
          fetchUserInfo(accessToken);
          $(' .webinar__loadingbar.first').css("display", "flex");
          dataLayer.push({
            'event': 'pa_new_webinar_registration_form_submitted',
            'webinar_name': $('.webinar__lightbox-title').html(),
          });

          $(".wr__pa-name").val(response.name);
          $(".wr__pa-email").val(response.email);
          $(".webinar-type").val(webinarType1);

          const paDetails = {
            utm_source: "PA Registered",
            pa_Name: $(".wr__pa-name").val(),
            pa_Email: $(".wr__pa-email").val(),
            webinar_Type: $(".webinar-type").val(),
          }
          var cookieValue = encodeURIComponent(JSON.stringify(paDetails));
          let expirationTime = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
          let hostnameParts = window.location.hostname.split('.');
          if (hostnameParts.length > 1) {
            hostnameParts.shift();
          }
          let domain = hostnameParts.join('.');
          console.log('---SET COOKIES---', domain);
          document.cookie = "Pa Data" + "=" + cookieValue + "; expires=" + expirationTime + "; path=/; domain=" + domain;
          $('.webinar__registration-form-pa').submit();
          $('.webinar__lightbox-card-pa').hide();
          setInterval(function () {
            $('.webinar__lightbox-card').removeClass("hide");
            $('.webinar__loadingbar.first').hide();
          }, 300);
        }
        localStorage.removeItem("WebinarType1");
      });
    }
  }
  function handleUserInfoError(xhr, status, error) {
    console.error('Error fetching user information:', error);
  }
  function removeTokenFromUrl() {
    history.replaceState(null, document.title, window.location.pathname);
    window.location.href = "https://" + window.location.hostname + "/pa-webinar-registration";
  }
});