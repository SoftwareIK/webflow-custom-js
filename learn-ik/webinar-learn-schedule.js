// https://cdn.jsdelivr.net/gh/kothinti/ik/webinar-schedule-v5.0.min.js
const timerState = {
  currentDate: '',
  nextDate: '',
  currentDateSec: '',
  nextDateSec: '',
};

function nextWebinar(currentDate, currentWebTime){
  let nextWebinarDate = '';
  for (let idx = 0; idx < webinarSchedule.length; idx++) {
      if (webinarSchedule[idx]) {
          const currentDateWeb = Date.parse(new Date(`${webinarSchedule[idx].date}, ${webinarSchedule[idx].time}`));
          if (currentDateWeb > currentWebTime) {
              //console.log('Webinar Date', webinarSchedule[idx].date, webinarSchedule[idx].time);
              nextWebinarDate = `${webinarSchedule[idx].date}, ${webinarSchedule[idx].time}`;
              break;
          }
      }
  }
  //console.log(nextWebinarDate);
  return nextWebinarDate;
};

function initStates(){
  timerState.currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  timerState.currentDateSec = Date.parse(timerState.currentDate);
  timerState.nextDate = nextWebinar(timerState.currentDate.split(',')[0], timerState.currentDateSec);
  if (timerState.nextDate !== '') {
      timerState.nextDateSec = Date.parse(timerState.nextDate);
  }
};

function unitCount(unit){
  const toTens = () => String(Number.parseInt(unit / 10));
  const toOnes = () => String(unit % 10);
  return toTens() + toOnes();
};

function unitaryCountHandler(){
  if (parseInt(document.querySelector('.webinar__timer--days > .webinar__timer--count').textContent) <= 1) {
      document.querySelectorAll('.webinar__timer--days > .webinar__timer--label').forEach((timer) => {
          timer.textContent = 'Day';
      });
  }
  if (parseInt(document.querySelector('.webinar__timer--hours > .webinar__timer--count').textContent) <= 1) {
      document.querySelectorAll('.webinar__timer--hours > .webinar__timer--label').forEach((timer) => {
          timer.textContent = 'Hr';
      });
  }
  if (parseInt(document.querySelector('.webinar__timer--mins > .webinar__timer--count').textContent) <= 1) {
      document.querySelectorAll('.webinar__timer--mins > .webinar__timer--label').forEach((timer) => {
          timer.textContent = 'Min';
      });
  }
  if (parseInt(document.querySelector('.webinar__timer--secs > .webinar__timer--count').textContent) <= 1) {
      document.querySelectorAll('.webinar__timer--secs > .webinar__timer--label').forEach((timer) => {
          timer.textContent = 'Sec';
      });
  }
};

function updateTimerUI(day, hrs, min, sec){
  document.querySelectorAll('.webinar__timer--days > .webinar__timer--count').forEach((timer) => {
      timer.textContent = day;
  });
  document.querySelectorAll('.webinar__timer--hours > .webinar__timer--count').forEach((timer) => {
      timer.textContent = hrs;
  });
  document.querySelectorAll('.webinar__timer--mins > .webinar__timer--count').forEach((timer) => {
      timer.textContent = min;
  });
  document.querySelectorAll('.webinar__timer--secs > .webinar__timer--count').forEach((timer) => {
      timer.textContent = sec;
  });

  unitaryCountHandler();
};

function TimerHandler(){
  // initialize states
  initStates();

  // start timer
  const webinarTimer = setInterval(() => {
      if (timerState.nextDate === '') {
          clearInterval(webinarTimer);
      }
      timerState.currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      timerState.currentDateSec = Date.parse(timerState.currentDate);

      const distanceCount = timerState.nextDateSec - timerState.currentDateSec;
      
      if (timerState.nextDateSec == "" || timerState.nextDateSec == null){
          
          if(document.querySelector('.webinar__nav-timer') != null){
              document.querySelector('.webinar__nav-timer').style.display = 'none';
          }
          
          if(document.querySelector('.webinar__timer') != null){
              document.querySelector('.webinar__timer').style.display = 'none';
          }
          
          $('.webinar__timer-nav').css("display","none");
          $('.webinar__timer').css("display","none");
          
          return;
      }
      
      //console.log("nextDateSec: "+timerState.nextDateSec);
      //console.log("distanceCount: "+distanceCount);

      const day = Math.floor(distanceCount / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((distanceCount % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const min = Math.floor((distanceCount % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((distanceCount % (1000 * 60)) / 1000);

      // separating into tens and ones

      const dayCount = unitCount(day);
      const hrCount = unitCount(hrs);
      const minCount = unitCount(min);
      const secCount = unitCount(sec);

      // update UI
      updateTimerUI(dayCount, hrCount, minCount, secCount);

      if (distanceCount <= 0) {
          // move timer to next date if reached 0
          initStates();

          if (timerState.nextDate === '') {
              clearInterval(webinarTimer);
              document.querySelectorAll('.webinar__timer').forEach((timer) => {
                  timer.classList.add('is-hidden');
              });
          }
      }
  }, 1000);
};

$( document ).ready(function() {
  TimerHandler();
});


//  scroll function which displays the timer in the sticky header
// below element selectors will only run for the home page.
const stickyTimerHandler = () => {
  window.onscroll = () => {
          if(document.querySelector('.webinar__nav-timer') == null) return;
              if (scrollY > document.querySelector('#numberRoller').offsetTop - 140) {
                  document.querySelector('.webinar__nav-timer').style.display = 'flex';
              } else {
                  document.querySelector('.webinar__nav-timer').style.display = 'none';
              }
  };
};