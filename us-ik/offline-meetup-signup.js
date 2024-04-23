$('.bc__alumni-meet-next').click(function (e) {
  e.preventDefault();
  let city = $('.city').val();
  let domainSelected = $('.gql-domain-select').val();
  let org = $('.organization').val();
  let isError = false;
  if (city == "") {
    isError = true;
    $('.error-msg-city').removeClass('hide');
  }
  if (domainSelected == "") {
    isError = true;
    $('.error-msg-domain').removeClass('hide');
  }
  if (org == "") {
    isError = true;
    $('.error-msg-org').removeClass('hide');
  }
  if (!isError) {
    $('.alumni__registration-block1').hide();
    $('.alumni__registration-block2').show();
  }
});

$('.bc__alumni-meet-submit').click(function (e) {
  e.preventDefault();

  const name = $(".name").val();
  const email = $(".email").val();

  let name_regex = new RegExp("^[a-zA-Z ]+$");
  let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  $(".name, .email").keypress(function () {
    $('.name-error, .email-id-error').addClass('hide');
  });

  $(".name, .email").focus(function () {
    $('.name-error, .email-id-error').addClass('hide');
  });

  if (
    (name.length == 0) &&
    (email.length == 0)) {
    $('.name-error ,.email-id-error').removeClass('hide');
  } else if (!name_regex.test(name) || name.length == 0) {
    $('.name-error').removeClass('hide');
  } else if (!email_regex.test(email) || email.length == 0) {
    $('.email-id-error').removeClass('hide');
  } else {
    const payload = {
      city: $('.city').val(),
      domain: $('.gql-domain-select').val(),
      organization: $('.organization').val(),
      name,
      email,
    }

    $('.webinar__loadingbar').css("display", "flex");
    $.ajax({
      type: "POST",
      url: "https://hooks.zapier.com/hooks/catch/11068981/3xpg0lq/",
      data: payload,
      success: function (e) {
        $('.alumni__registration-step2').hide();
        $('.webinar__loadingbar').css("display", "none");
        $('.meetup-form-success').show();
      },
      error: function (e) {
        $('.alumni__registration-step2').show();
        $('.webinar__loadingbar').css("display", "none");
        $('.meetup-form-error').show();
      }
    });
  }
})
