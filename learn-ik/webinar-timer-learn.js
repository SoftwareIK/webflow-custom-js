function generateScheduleForDaysOfWeek(startDate, endDate) {
  const dateSet = new Set();
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  while (currentDate <= endDateObj) {
    if (currentDate.getDay() !== 6) { // Skip Saturday
      const formattedDate = currentDate.toLocaleDateString("en-US");
      dateSet.add(formattedDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const uniqueDates = [...dateSet];
  var webinarSchedule = uniqueDates.map((formattedDate) => {
    const date = new Date(formattedDate);
    let time;
    switch (date.getDay()) {
      case 0: // Sunday
        time = "07:30:00 PM";
        break;
      case 1: // Monday
        time = "06:30:00 PM";
        break;
      case 2: // Tuesday
        time = "07:30:00 PM";
        break;
      case 3: // Wednesday
        time = "06:30:00 PM";
        break;
      case 4: // Thursday
        time = "07:30:00 PM";
        break;
      case 5: // Friday
        time = "06:30:00 PM";
        break;
    }
    return {
      date: formattedDate,
      time: time,
    };
  });
  return webinarSchedule;
}

// Generate unique dates for a period
const startDate = "01/01/2024";
const endDate = "06/01/2024";
