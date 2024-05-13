function generateScheduleINDForDaysOfWeek(startDate, endDate) {
  const dateSet = new Set();
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  while (currentDate <= endDateObj) {
    if (currentDate.getDay() !== 0) { // Skip Sunday
      const formattedDate = formatDate(currentDate); // Using the formatDate function
      dateSet.add(formattedDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const uniqueDates = [...dateSet];
  const indiaTimeSlots = {
    0: "06:00:00 PM", // sunday
    1: "06:00:00 PM", // Monday
    2: "06:00:00 PM", // Tuesday
    3: "06:00:00 PM", // Wednesday
    4: "06:00:00 PM", // Thursday
    5: "06:00:00 PM", // Friday
    6: "11:00:00 PM", // Saturday
  };
  const webinarScheduleIndia = uniqueDates.map((formattedDate) => {
    const date = new Date(formattedDate);
    const time = indiaTimeSlots[date.getDay()];
    return {
      date: formattedDate,
      time: time,
    };
  });
  return webinarScheduleIndia;
}

function generateScheduleUSAForDaysOfWeek(startDate, endDate) {
  const dateSet = new Set();
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  while (currentDate <= endDateObj) {
    if (currentDate.getDay() !== 6) { // Skip Saturday
      const formattedDate = formatDate(currentDate); // Using the formatDate function
      dateSet.add(formattedDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const uniqueDates = [...dateSet];
  const usaTimeSlots = {
    0: "08:30:00 PM", // Sunday
    1: "07:30:00 PM", // Monday
    2: "08:30:00 PM", // Tuesday
    3: "07:30:00 PM", // Wednesday
    4: "08:30:00 PM", // Thursday
    5: "07:30:00 PM", // Friday
  };
  const webinarScheduleUSA = uniqueDates.map((formattedDate) => {
    const date = new Date(formattedDate);
    const time = usaTimeSlots[date.getDay()];
    return {
      date: formattedDate,
      time: time,
    };
  });
  return webinarScheduleUSA;
}
function formatDate(date1) {
  const month = String(date1.getMonth() + 1).padStart(2, "0");
  const day = String(date1.getDate()).padStart(2, "0");
  const year = date1.getFullYear();
  return `${month}/${day}/${year}`;
}
// Generate unique dates for a 6 month period (from 02/27/2024 to 11/30/2024)
const startDate = "02/27/2024";
const endDate = "11/30/2024";
const webinarScheduleIndia = generateScheduleINDForDaysOfWeek(startDate, endDate);
console.log("india", webinarScheduleIndia);
const webinarScheduleUSA = generateScheduleUSAForDaysOfWeek(startDate, endDate);
console.log("USA", webinarScheduleUSA);