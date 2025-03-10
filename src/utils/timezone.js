// File: src/utils/timezone.js

/**
 * Formats a date string for display in student's timezone
 * @param {string|Date} dateString - Date to format
 * @param {string} timezone - Student's timezone (e.g., 'America/New_York')
 * @returns {string} - Formatted date
 */
export function formatDateForStudent(
  dateString,
  timezone = "America/New_York"
) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
}

/**
 * Formats a time string for display in student's timezone
 * @param {string|Date} dateString - Date to format
 * @param {string} timezone - Student's timezone (e.g., 'America/New_York')
 * @returns {string} - Formatted time
 */
export function formatTimeForStudent(
  dateString,
  timezone = "America/New_York"
) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return String(dateString);
  }
}

/**
 * Formats a date and time string with timezone info
 * @param {string|Date} dateString - Date to format
 * @param {string} timezone - Student's timezone (e.g., 'America/New_York')
 * @returns {string} - Formatted date and time with timezone
 */
export function formatDateTimeWithTimezone(
  dateString,
  timezone = "America/New_York"
) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  } catch (error) {
    console.error("Error formatting datetime with timezone:", error);
    return String(dateString);
  }
}
