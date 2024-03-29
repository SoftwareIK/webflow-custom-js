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
        time = "08:30:00 PM";
        break;
      case 1: // Monday
        time = "07:30:00 PM";
        break;
      case 2: // Tuesday
        time = "08:30:00 PM";
        break;
      case 3: // Wednesday
        time = "07:30:00 PM";
        break;
      case 4: // Thursday
        time = "8:30:00 PM";
        break;
      case 5: // Friday
        time = "07:30:00 PM";
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
const startDate = "01/01/2024"; //MM-DD-YYYY
const endDate = "11/30/2024"; //MM-DD-YYYY
