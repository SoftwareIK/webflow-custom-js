// https://cdn.jsdelivr.net/gh/kothinti/ik/exit-intent-bc-popup-v1.3.3.min.js
$(document).ready(function () {
  let exitIntentBCpopup = getCookie("exitIntentBCpopup");
  
  if((exitIntentBCpopup != "false") && (bcExitIntentOnBrowserTab == "true")){
      setCookie("exitIntentBCpopup","false");
      exitIntentBCpopup = true;
  }else{
      exitIntentBCpopup = false;
  }
  
      // scrolling
      let prevScrollpos = window.pageYOffset;
      window.addEventListener("scroll", function () {
          let currentScrollPos = window.pageYOffset;

          // Check if the scroll position is 1 rem or less
          //console.log(currentScrollPos, prevScrollpos)
          if(exitIntentBCpopup){
              if (prevScrollpos > currentScrollPos && (prevScrollpos - currentScrollPos) >= 400) {
                  $('.webinar__lightbox').css('display','flex');
                  $('.is_exit_intent_popup').val("On Scroll");
                  dataLayer.push({
                      'event': 'exit_intent',
                      'eventCategory': 'exit_intent_scroll',
                      'eventAction': 'exit_intent_scroll',
                      'eventLabel': 'form triggered'
                  });
                  exitIntentBCpopup = false;
              }

              if (currentScrollPos > prevScrollpos)
              prevScrollpos = currentScrollPos
          }
      });

  $(document).mouseleave(function () {
      if(exitIntentBCpopup){
          $('.webinar__lightbox').css('display','flex');
          $('.is_exit_intent_popup').val("Browser Tab");
          dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_browser_tab_close_gesture',
              'eventAction': 'exit_intent_browser_tab_close_gesture',
              'eventLabel': 'form triggered'
          });
          exitIntentBCpopup = false;
      }
  });
});