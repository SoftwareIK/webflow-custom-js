/**
 * Minified by jsDelivr using Terser v5.19.2.
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
//https://cdn.jsdelivr.net/gh/sohamtest/ik@main/webinar-timer-us.v1.1.js
const timerState = {
  currentDate: "",
  nextDate: "",
  currentDateSec: "",
  nextDateSec: "",
};
function nextWebinar(e, t, r) {
  let n = "";
  webinarSchedule = "IST" == r ? webinarScheduleIndia : webinarScheduleUSA;
  for (let e = 0; e < webinarSchedule.length; e++)
    if (webinarSchedule[e]) {
      if (
        Date.parse(
          new Date(`${webinarSchedule[e].date}, ${webinarSchedule[e].time}`)
        ) > t
      ) {
        n = `${webinarSchedule[e].date}, ${webinarSchedule[e].time}`;
        break;
      }
    }
  return n;
}
function initStates(e) {
  (timerState.currentDate = new Date().toLocaleString("en-US", {
    timeZone: e,
  })),
    (timerState.currentDateSec = Date.parse(timerState.currentDate)),
    (timerState.nextDate = nextWebinar(
      timerState.currentDate.split(",")[0],
      timerState.currentDateSec,
      e
    )),
    "" !== timerState.nextDate &&
      (timerState.nextDateSec = Date.parse(timerState.nextDate));
}
function unitCount(e) {
  return String(Number.parseInt(e / 10)) + String(e % 10);
}
function unitaryCountHandler() {
  parseInt(
    document.querySelector(".webinar__timer--days > .webinar__timer--count")
      .textContent
  ) <= 1 &&
    document
      .querySelectorAll(".webinar__timer--days > .webinar__timer--label")
      .forEach((e) => {
        e.textContent = "Day";
      }),
    parseInt(
      document.querySelector(".webinar__timer--hours > .webinar__timer--count")
        .textContent
    ) <= 1 &&
      document
        .querySelectorAll(".webinar__timer--hours > .webinar__timer--label")
        .forEach((e) => {
          e.textContent = "Hr";
        }),
    parseInt(
      document.querySelector(".webinar__timer--mins > .webinar__timer--count")
        .textContent
    ) <= 1 &&
      document
        .querySelectorAll(".webinar__timer--mins > .webinar__timer--label")
        .forEach((e) => {
          e.textContent = "Min";
        }),
    parseInt(
      document.querySelector(".webinar__timer--secs > .webinar__timer--count")
        .textContent
    ) <= 1 &&
      document
        .querySelectorAll(".webinar__timer--secs > .webinar__timer--label")
        .forEach((e) => {
          e.textContent = "Sec";
        });
}
function updateTimerUI(e, t, r, n) {
  document
    .querySelectorAll(".webinar__timer--days > .webinar__timer--count")
    .forEach((t) => {
      t.textContent = e;
    }),
    document
      .querySelectorAll(".webinar__timer--hours > .webinar__timer--count")
      .forEach((e) => {
        e.textContent = t;
      }),
    document
      .querySelectorAll(".webinar__timer--mins > .webinar__timer--count")
      .forEach((e) => {
        e.textContent = r;
      }),
    document
      .querySelectorAll(".webinar__timer--secs > .webinar__timer--count")
      .forEach((e) => {
        e.textContent = n;
      }),
    unitaryCountHandler();
}
function TimerHandler(e) {
  initStates(e);
  const t = setInterval(() => {
    "" === timerState.nextDate && clearInterval(t),
      (timerState.currentDate = new Date().toLocaleString("en-US", {
        timeZone: e,
      })),
      (timerState.currentDateSec = Date.parse(timerState.currentDate));
    const r = timerState.nextDateSec - timerState.currentDateSec;
    if ("" == timerState.nextDateSec || null == timerState.nextDateSec)
      return (
        null != document.querySelector(".webinar__nav-timer") &&
          (document.querySelector(".webinar__nav-timer").style.display =
            "none"),
        null != document.querySelector(".webinar__timer") &&
          (document.querySelector(".webinar__timer").style.display = "none"),
        $(".webinar__timer-nav").css("display", "none"),
        void $(".webinar__timer").css("display", "none")
      );
    const n = Math.floor(r / 864e5),
      a = Math.floor((r % 864e5) / 36e5),
      i = Math.floor((r % 36e5) / 6e4),
      o = Math.floor((r % 6e4) / 1e3);
    updateTimerUI(unitCount(n), unitCount(a), unitCount(i), unitCount(o)),
      r <= 0 &&
        (initStates(e),
        "" === timerState.nextDate &&
          (clearInterval(t),
          document.querySelectorAll(".webinar__timer").forEach((e) => {
            e.classList.add("is-hidden");
          })));
  }, 1e3);
}
const stickyTimerHandler = () => {
  window.onscroll = () => {
    null != document.querySelector(".webinar__nav-timer") &&
      (scrollY > document.querySelector("#numberRoller").offsetTop - 140
        ? (document.querySelector(".webinar__nav-timer").style.display = "flex")
        : (document.querySelector(".webinar__nav-timer").style.display =
            "none"));
  };
};
//# sourceMappingURL=/sm/5452c55baa02e545d082679c8b063986300bd578778601169e9a4c8efa3c457f.map
