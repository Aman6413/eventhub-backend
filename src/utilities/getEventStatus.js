import moment from "moment";

// Returns one of: "UPCOMING", "REGISTRATION_CLOSED", "LIVE", "COMPLETED"
const getEventStatus = (event) => {
  const today = moment().startOf("day");

  // Parse event date (stored as DD-MM-YYYY)
  const eventDate = event?.date
    ? moment(event.date, "DD-MM-YYYY")
    : null;

  // Parse registration deadline (stored as YYYY-MM-DD)
  const deadline = event?.registrationDeadline
    ? moment(event.registrationDeadline, "YYYY-MM-DD")
    : null;

  // 1) If event date is before today => COMPLETED
  if (eventDate && eventDate.isBefore(today, "day")) {
    return "COMPLETED";
  }

  // 2) If registration deadline exists and today is after it => REGISTRATION_CLOSED
  if (deadline && today.isAfter(deadline, "day")) {
    return "REGISTRATION_CLOSED";
  }

  // 3) If event is today => decide LIVE or UPCOMING based on time
  if (eventDate && eventDate.isSame(today, "day")) {
    // parse event start time if available (time stored as 'h:mm A')
    const eventStart = event.time
      ? moment(`${event.date} ${event.time}`, "DD-MM-YYYY h:mm A")
      : eventDate.clone().startOf("day");

    const now = moment();
    if (now.isSameOrAfter(eventStart)) {
      return "LIVE";
    }

    return "UPCOMING";
  }

  // Default
  return "UPCOMING";
};

export default getEventStatus;
