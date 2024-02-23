// https://interviewkickstart.albiorixtech.in/subscription-modal.js
$(document).ready(function () {
  $('.subscription-email-form-btn').click(function (e) {
    e.preventDefault();
    let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    $(".email").keypress(function () {
      $('.email-id-error').addClass('hide');
    });
    $(".email").focus(function () {
      $('.email-id-error').addClass('hide');
    });
    if (!email_regex.test($("#email-address4").val()) || $("#email-address4").val().length == 0) {
      $('.email-id-error').removeClass('hide');
      console.log("if")
    }
    // else if (!email_regex.test($(".email").val()) || $(".email").val().length == 0) {
    //   $('.email-id-error').removeClass('hide');
    //   console.log("if")
    // }
    else {
      $('.wr__email').val($("#email-address4").val());
      var formData = {
        "Email Address": $('.wr__email').val(),
        "page_url": $(".page_url").val(),
      };
      $.ajax({
        type: "POST",
        url: "https://hooks.zapier.com/hooks/catch/11068981/3qv4l6r/",
        data: formData,
        success: function (e) {
          if (e.status == "success") {
            console.log("Form submitted successfully!");
          }
        }
      });
      $(".w-form-done").css("display", "block");
      $(".subscription-email-form").css("display", "none")
    }
  });
});