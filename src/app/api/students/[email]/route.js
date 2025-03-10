// File: src/app/api/student/[email]/route.js
import { NextResponse } from "next/server";

// Field mappings adjusted to match your actual Airtable field names
const FIELDS = {
  FIRST_NAME: "First Name",
  LAST_NAME: "Last Name",
  EMAIL: "Email",
  GOOGLE_MEETS_URL: "Google Meets Url",
  TRELLO_URL: "Trello Url",
  SLACK_CHANNEL: "Slack Channel Url",
  DATE_ENROLLED: "Date Enrolled",
  ACTIVE_STUDENT: "Active Student",
  APPLICATION_URL: "Application Url",
  SCHEDULED_CLASSES: "Scheduled Classes",
  TIMEZONE: "Timezone", // New field for student timezone
};

// The table name in your Airtable base
const TABLE_NAME = "Students";

export async function GET(req, { params }) {
  try {
    const email = params.email;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email parameter is required",
        },
        { status: 400 }
      );
    }

    const baseId = process.env.AIRTABLE_BASE_ID;

    // Build filter formula to get student by email
    const filterFormula = `?filterByFormula={${
      FIELDS.EMAIL
    }}="${encodeURIComponent(email)}"`;

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        TABLE_NAME
      )}${filterFormula}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable API error:", errorData);

      if (response.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded. Please try again in 30 seconds.",
          },
          { status: 429 }
        );
      }
      throw new Error(errorData.error?.message || "Failed to fetch student");
    }

    const data = await response.json();

    // Check if student was found
    if (data.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found with this email",
        },
        { status: 404 }
      );
    }

    // Format the student data
    const record = data.records[0];

    let student = {
      id: record.id,
      name: `${record.fields[FIELDS.FIRST_NAME] || ""} ${
        record.fields[FIELDS.LAST_NAME] || ""
      }`.trim(),
      firstName: record.fields[FIELDS.FIRST_NAME] || "",
      lastName: record.fields[FIELDS.LAST_NAME] || "",
      email: record.fields[FIELDS.EMAIL] || "",
      googleMeetsUrl: record.fields[FIELDS.GOOGLE_MEETS_URL] || "",
      trelloUrl: record.fields[FIELDS.TRELLO_URL] || "",
      slackChannel: record.fields[FIELDS.SLACK_CHANNEL] || "",
      dateEnrolled: record.fields[FIELDS.DATE_ENROLLED] || "",
      activeStudent: record.fields[FIELDS.ACTIVE_STUDENT] === "true", // Convert string to boolean
      applicationUrl: record.fields[FIELDS.APPLICATION_URL] || "",
      timezone: record.fields[FIELDS.TIMEZONE] || "America/New_York", // Default to US Eastern
    };

    // Parse the scheduled classes if they exist
    if (record.fields[FIELDS.SCHEDULED_CLASSES]) {
      try {
        student.scheduledClasses = JSON.parse(
          record.fields[FIELDS.SCHEDULED_CLASSES]
        );
      } catch (e) {
        console.error("Error parsing scheduled classes:", e);
        student.scheduledClasses = [];
      }
    } else {
      student.scheduledClasses = [];
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
