const timerState = {
  currentDate: "",
  nextDate: "",
  currentDateSec: "",
  nextDateSec: "",
};

// This function will be in use when upcoming-slots api fails.
function fallbackTimerDate(tz = "") {
  const isIndia = tz == "IST" || tz == "Asia/Kolkata";
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const dateString = currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: '2-digit', day: '2-digit', year: 'numeric' });
  let timeString;

  if (isIndia) {
    if (dayOfWeek === 6) {
      // Saturday
      timeString = "11:00:00 PM";
    } else if (dayOfWeek === 0) {
      // Sunday
      return ""; // Skip on Sunday
    } else {
      timeString = "06:00:00 PM";
    }
  } else {
    if (dayOfWeek === 6) {
      // Saturday
      return ""; // Skip on Saturday
    } else if (dayOfWeek % 2 === 1) {
      // Odd days (Monday, Wednesday, Friday, Sunday)
      timeString = "07:30:00 PM";
    } else {
      // Even days (Tuesday, Thursday)
      timeString = "08:30:00 PM";
    }
  }

  return `${dateString}, ${timeString}`
}

function nextWebinar(currentDate, currentWebTime, tz, slots) {
  let nextWebinarDate = "";

  if (!slots) {
    return fallbackTimerDate(tz)
  }

  const formattedSlots = (slots || [])?.map((slot = {}) => ({
    date: `${slot.month}/${slot.day}/${slot.year}`, //"06/12/2024"
    time: `${slot.hour}:${slot.minute}:${slot.second} ${slot.am_or_pm}`, //"07:30:00 PM"
  }))

  webinarSchedule = (tz == "IST" || tz == "Asia/Kolkata") ? webinarScheduleIndia : webinarScheduleUSA;

  for (let idx = 0; idx < formattedSlots.length; idx++) {
    if (formattedSlots[idx]) {
      const currentDateWeb = Date.parse(
        new Date(`${formattedSlots[idx].date}, ${formattedSlots[idx].time}`)
      );
      if (currentDateWeb > currentWebTime) {
        nextWebinarDate = `${formattedSlots[idx].date}, ${formattedSlots[idx].time}`;
        break;
      }
    }
  }
  return nextWebinarDate;
}

function initStates(tz, slots) {
  try {
    timerState.currentDate = new Date().toLocaleString("en-US", { timeZone: tz });
  } catch (error) {
    
  }
  timerState.currentDateSec = Date.parse(timerState.currentDate);
  timerState.nextDate = nextWebinar(
    timerState.currentDate.split(",")[0],
    timerState.currentDateSec,
    tz,
    slots
  );
  if (timerState.nextDate !== "") {
    timerState.nextDateSec = Date.parse(timerState.nextDate);
  }
}

function unitCount(unit) {
  const toTens = () => String(Number.parseInt(unit / 10));
  const toOnes = () => String(unit % 10);
  return toTens() + toOnes();
}

function unitaryCountHandler() {
  if (
    parseInt(
      document.querySelector(".webinar__timer--days > .webinar__timer--count")
        .textContent
    ) <= 1
  ) {
    document
      .querySelectorAll(".webinar__timer--days > .webinar__timer--label")
      .forEach((timer) => {
        timer.textContent = "Day";
      });
  }
  if (
    parseInt(
      document.querySelector(".webinar__timer--hours > .webinar__timer--count")
        .textContent
    ) <= 1
  ) {
    document
      .querySelectorAll(".webinar__timer--hours > .webinar__timer--label")
      .forEach((timer) => {
        timer.textContent = "Hr";
      });
  }
  if (
    parseInt(
      document.querySelector(".webinar__timer--mins > .webinar__timer--count")
        .textContent
    ) <= 1
  ) {
    document
      .querySelectorAll(".webinar__timer--mins > .webinar__timer--label")
      .forEach((timer) => {
        timer.textContent = "Min";
      });
  }
  if (
    parseInt(
      document.querySelector(".webinar__timer--secs > .webinar__timer--count")
        .textContent
    ) <= 1
  ) {
    document
      .querySelectorAll(".webinar__timer--secs > .webinar__timer--label")
      .forEach((timer) => {
        timer.textContent = "Sec";
      });
  }
}

function updateTimerUI(day, hrs, min, sec) {
  document
    .querySelectorAll(".webinar__timer--days > .webinar__timer--count")
    .forEach((timer) => {
      timer.textContent = day;
    });
  document
    .querySelectorAll(".webinar__timer--hours > .webinar__timer--count")
    .forEach((timer) => {
      timer.textContent = hrs;
    });
  document
    .querySelectorAll(".webinar__timer--mins > .webinar__timer--count")
    .forEach((timer) => {
      timer.textContent = min;
    });
  document
    .querySelectorAll(".webinar__timer--secs > .webinar__timer--count")
    .forEach((timer) => {
      timer.textContent = sec;
    });

  unitaryCountHandler();
}

function TimerHandler(tz, slots) {
  // initialize states
  initStates(tz, slots);

  // start timer
  const webinarTimer = setInterval(() => {
    if (timerState.nextDate === "") {
      clearInterval(webinarTimer);
    }
    timerState.currentDate = new Date().toLocaleString("en-US", {
      timeZone: tz,
    });
    timerState.currentDateSec = Date.parse(timerState.currentDate);

    const distanceCount = timerState.nextDateSec - timerState.currentDateSec;

    if (timerState.nextDateSec == "" || timerState.nextDateSec == null) {
      if (document.querySelector(".webinar__nav-timer") != null) {
        document.querySelector(".webinar__nav-timer").style.display = "none";
      }

      if (document.querySelector(".webinar__timer") != null) {
        document.querySelector(".webinar__timer").style.display = "none";
      }

      $(".webinar__timer-nav").css("display", "none");
      $(".webinar__timer").css("display", "none");

      return;
    }

    const day = Math.floor(distanceCount / (1000 * 60 * 60 * 24));
    const hrs = Math.floor(
      (distanceCount % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
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
      initStates(tz, slots);

      if (timerState.nextDate === "") {
        clearInterval(webinarTimer);
        document.querySelectorAll(".webinar__timer").forEach((timer) => {
          timer.classList.add("is-hidden");
        });
      }
    }
  }, 1000);
}

const stickyTimerHandler = () => {
  window.onscroll = () => {
    if (document.querySelector(".webinar__nav-timer") == null) return;
    if (scrollY > document.querySelector("#numberRoller").offsetTop - 140) {
      document.querySelector(".webinar__nav-timer").style.display = "flex";
    } else {
      document.querySelector(".webinar__nav-timer").style.display = "none";
    }
  };
};
