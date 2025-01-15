function generateWebinarSlots({ count, country, targetTimezone, webinarType }) {
  const getSlotConfigs = (region) => {
    switch (region) {
      case "IND":
        return {
          skipDay: 0, // Skip Sunday
          timeSlots: {
            0: null, // Skip Sunday
            1: "18:00:00", // Monday
            2: "18:00:00", // Tuesday
            3: "18:00:00", // Wednesday
            4: "18:00:00", // Thursday
            5: "18:00:00", // Friday
            6: "11:00:00", // Saturday
          },
          timeZone: "Asia/Kolkata",
          utcOffset: 5.5, // Offset in hours
        };
      default:
        return {
          skipDay: 6, // Skip Saturday
          timeSlots: {
            0: "20:30:00", // Sunday
            1: "19:30:00", // Monday
            2: "20:30:00", // Tuesday
            3: "19:30:00", // Wednesday
            4: "20:30:00", // Thursday
            5: "19:30:00", // Friday
            6: null, // Skip Saturday
          },
          timeZone: "America/New_York",
          utcOffset: -5, // Offset in hours
        };
    }
  };
  const formatDateWithTimezone = (date, offsetHours) => {
    // Get the year, month, day, hours, minutes, and seconds from the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Calculate the absolute offset in hours and minutes
    const totalMinutesOffset = offsetHours * 60; // Convert fractional offset to total minutes
    const offsetHoursPart = Math.floor(Math.abs(totalMinutesOffset) / 60); // Integer hours
    const offsetMinutesPart = Math.abs(totalMinutesOffset) % 60; // Remainder as minutes

    // Construct the offset string in ±HH:mm format
    const formattedOffset = `${offsetHours >= 0 ? "+" : "-"}${String(
      offsetHoursPart
    ).padStart(2, "0")}:${String(offsetMinutesPart).padStart(2, "0")}`;

    // Combine into the final ISO format
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${formattedOffset}`;
  };
  const convertToUTC = (dateString) => {
    // Parse the date using the timezone in the input string
    const localDate = new Date(dateString);

    // Convert to UTC components
    const utcYear = localDate.getUTCFullYear();
    const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const utcDate = String(localDate.getUTCDate()).padStart(2, "0");
    const utcHours = String(localDate.getUTCHours()).padStart(2, "0");
    const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, "0");
    const utcSeconds = String(localDate.getUTCSeconds()).padStart(2, "0");

    // Construct the UTC string in the desired format
    return `${utcYear}-${utcMonth}-${utcDate}T${utcHours}:${utcMinutes}:${utcSeconds}+00:00`;
  };
  const toTargetTimezone = (dateString, targetTimezone) => {
    // Parse the input date string
    const date = new Date(dateString);

    // Use Intl.DateTimeFormat to format the date in the target timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23", // 24-hour format
    });

    // Format the date to the target timezone
    const parts = formatter.formatToParts(date);

    // Extract parts and construct ISO string
    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    const hour = parts.find((p) => p.type === "hour").value;
    const minute = parts.find((p) => p.type === "minute").value;
    const second = parts.find((p) => p.type === "second").value;

    return `${year}-${month}-${day}T${hour.padStart(2, "0")}:${minute.padStart(
      2,
      "0"
    )}:${second.padStart(2, "0")}`;
  };
  const formatTime = (date) => {
    return date
      .toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      ?.replaceAll(" ", "");
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0"); // Pad day with leading zero
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("en-US", { weekday: "long" });

    return `${weekday}, ${month} ${day}, ${year}`;
  };
  const addOffset = (dateString, timezone) => {
    try {
      const date = new Date();
      const options = { timeZone: timezone, timeZoneName: "longOffset" };

      let offset =
        Intl.DateTimeFormat("en-US", options)
          .formatToParts(date)
          .find((part) => part.type === "timeZoneName")
          ?.value?.replace("GMT", "") || "+00:00";

      // Add padding to hours if needed
      if (offset.match(/^[+-]\d:/)) {
        offset = offset.replace(/^([+-])(\d):/, "$10$2:");
      }

      return `${dateString}${offset}`;
    } catch {
      return `${dateString}"+00:00"`;
    }
  };

  const slotConfig = getSlotConfigs(country);

  if (!slotConfig) {
    throw new Error("Invalid country.");
  }

  const {
    skipDay,
    timeSlots,
    utcOffset: slotUTCOffset,
    timeZone: slotTimezone,
  } = slotConfig;

  const result = [];
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: slotTimezone })
  );

  for (let i = 0; i < count; i++) {
    const startSlotTime = new Date(now);
    startSlotTime.setDate(startSlotTime.getDate() + i);

    const day = startSlotTime.getDay();
    if (day === skipDay) {
      continue;
    }

    const slotTime = timeSlots[day];
    if (!slotTime) {
      continue;
    }

    const [hours, minutes, seconds] = slotTime.split(":").map(Number);
    startSlotTime.setHours(hours);
    startSlotTime.setMinutes(minutes);
    startSlotTime.setSeconds(seconds);

    // Skip past slots
    if (startSlotTime < new Date(now)) {
      continue;
    }

    const endSlotTime = new Date(startSlotTime);
    endSlotTime.setHours(endSlotTime.getHours() + 1);

    const formatted_start_slot_time = formatDateWithTimezone(
      startSlotTime,
      slotUTCOffset
    );
    const formatted_end_slot_time = formatDateWithTimezone(
      endSlotTime,
      slotUTCOffset
    );

    const user_start_time_obj = new Date(
      toTargetTimezone(formatted_start_slot_time, targetTimezone)
    );
    const user_end_time_obj = new Date(
      toTargetTimezone(formatted_end_slot_time, targetTimezone)
    );

    result.push({
      start_time: addOffset(
        toTargetTimezone(formatted_start_slot_time, targetTimezone),
        targetTimezone
      ),
      end_time: addOffset(
        toTargetTimezone(formatted_end_slot_time, targetTimezone),
        targetTimezone
      ),
      utc_start_time: convertToUTC(formatted_start_slot_time),
      utc_end_time: convertToUTC(formatted_end_slot_time),
      day: String(user_start_time_obj.getDate()).padStart(2, "0"),
      month: String(user_start_time_obj.getMonth() + 1).padStart(2, "0"),
      year: String(user_start_time_obj.getFullYear()),
      hour: String(user_start_time_obj.getHours() % 12 || 12).padStart(2, "0"),
      minute: String(user_start_time_obj.getMinutes()).padStart(2, "0"),
      second: String(user_start_time_obj.getSeconds()).padStart(2, "0"),
      am_or_pm: user_start_time_obj.getHours() >= 12 ? "PM" : "AM",
      weekday: user_start_time_obj.toLocaleString("en-US", { weekday: "long" }),
      invitee_start_time: `${formatTime(user_start_time_obj)} - ${formatDate(
        user_start_time_obj
      )}`,
      invitee_end_time: `${formatTime(user_end_time_obj)} - ${formatDate(
        user_end_time_obj
      )}`,
      webinar_lead_type: webinarType,
    });
  }
  return result;
}