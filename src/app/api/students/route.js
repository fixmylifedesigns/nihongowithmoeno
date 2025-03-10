// File: src/app/api/students/route.js
import { NextResponse } from "next/server";

// Field mappings adjusted to match your actual Airtable field names
const FIELDS = {
  FIRST_NAME: "First Name",
  LAST_NAME: "Last Name",
  EMAIL: "Email",
  GOOGLE_MEETS_URL: "Google Meets Url", // Note: "Url" not "URL"
  TRELLO_URL: "Trello Url",
  SLACK_CHANNEL: "Slack Channel Url", // Note: Full field name
  DATE_ENROLLED: "Date Enrolled",
  ACTIVE_STUDENT: "Active Student",
  APPLICATION_URL: "Application Url",
  SCHEDULED_CLASSES: "Scheduled Classes",
  TIMEZONE: "Timezone", // New field for student timezone
};

// The table name in your Airtable base
const TABLE_NAME = "Students";

export async function POST(req) {
  try {
    const data = await req.json();
    const baseId = process.env.AIRTABLE_BASE_ID;

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                [FIELDS.FIRST_NAME]: data.firstName,
                [FIELDS.LAST_NAME]: data.lastName,
                [FIELDS.EMAIL]: data.email,
                [FIELDS.GOOGLE_MEETS_URL]: data.googleMeetsUrl || "",
                [FIELDS.TRELLO_URL]: data.trelloUrl || "",
                [FIELDS.SLACK_CHANNEL]: data.slackChannel || "",
                [FIELDS.DATE_ENROLLED]:
                  data.dateEnrolled || new Date().toISOString().split("T")[0],
                [FIELDS.ACTIVE_STUDENT]:
                  data.activeStudent !== undefined
                    ? String(data.activeStudent)
                    : "true", // Convert to string
                [FIELDS.APPLICATION_URL]: data.applicationUrl || "",
                [FIELDS.SCHEDULED_CLASSES]: data.scheduledClasses
                  ? JSON.stringify(data.scheduledClasses)
                  : "[]",
                [FIELDS.TIMEZONE]: data.timezone || "America/New_York", // Default timezone
              },
            },
          ],
          // Enable typecast to handle any minor data format issues
          typecast: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable API error:", errorData);

      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded. Please try again in 30 seconds.",
          },
          { status: 429 }
        );
      }
      throw new Error(
        errorData.error?.message || "Failed to create student record"
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, record: result.records[0] });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const onlyActive = url.searchParams.get("active") === "true";

    let filterFormula = "";

    // Build filter formula
    if (email) {
      // If email is provided, filter by that specific email
      filterFormula = `?filterByFormula={${FIELDS.EMAIL}}="${encodeURIComponent(
        email
      )}"`;
    } else if (onlyActive) {
      // If only active students are requested
      filterFormula = `?filterByFormula={${FIELDS.ACTIVE_STUDENT}}="true"`;
    }

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
      throw new Error(errorData.error?.message || "Failed to fetch students");
    }

    const data = await response.json();

    // Process the data to transform it into a more usable format
    const formattedStudents = data.records
      .map((record) => {
        // Skip records with empty fields
        if (!record.fields || Object.keys(record.fields).length === 0) {
          return null;
        }

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
          // Add timezone with a default value
          timezone: record.fields[FIELDS.TIMEZONE] || "America/New_York",
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

        return student;
      })
      .filter((student) => student !== null); // Remove null entries

    return NextResponse.json({
      success: true,
      data: formattedStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH route to update a student
export async function PATCH(req) {
  try {
    const data = await req.json();
    const baseId = process.env.AIRTABLE_BASE_ID;

    // Ensure ID is provided
    if (!data.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID is required for updates",
        },
        { status: 400 }
      );
    }

    // Prepare the fields to update
    const fields = {};
    if (data.firstName) fields[FIELDS.FIRST_NAME] = data.firstName;
    if (data.lastName) fields[FIELDS.LAST_NAME] = data.lastName;
    if (data.email) fields[FIELDS.EMAIL] = data.email;
    if (data.googleMeetsUrl !== undefined)
      fields[FIELDS.GOOGLE_MEETS_URL] = data.googleMeetsUrl;
    if (data.trelloUrl !== undefined)
      fields[FIELDS.TRELLO_URL] = data.trelloUrl;
    if (data.slackChannel !== undefined)
      fields[FIELDS.SLACK_CHANNEL] = data.slackChannel;
    if (data.dateEnrolled) fields[FIELDS.DATE_ENROLLED] = data.dateEnrolled;
    if (data.activeStudent !== undefined)
      fields[FIELDS.ACTIVE_STUDENT] = String(data.activeStudent); // Convert to string
    if (data.applicationUrl !== undefined)
      fields[FIELDS.APPLICATION_URL] = data.applicationUrl;
    if (data.scheduledClasses)
      fields[FIELDS.SCHEDULED_CLASSES] = JSON.stringify(data.scheduledClasses);
    // Add support for updating timezone
    if (data.timezone) fields[FIELDS.TIMEZONE] = data.timezone;

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              id: data.id,
              fields: fields,
            },
          ],
          // Enable typecast to handle any minor data format issues
          typecast: true,
        }),
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
      throw new Error(
        errorData.error?.message || "Failed to update student record"
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, record: result.records[0] });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE route to remove a student or deactivate them
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const softDelete = url.searchParams.get("softDelete") === "true";
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID is required",
        },
        { status: 400 }
      );
    }

    // If soft delete is requested, we just mark the student as inactive
    if (softDelete) {
      const response = await fetch(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
          TABLE_NAME
        )}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                id: id,
                fields: {
                  [FIELDS.ACTIVE_STUDENT]: "false", // Use string "false"
                },
              },
            ],
            typecast: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Airtable API error:", errorData);
        throw new Error(
          errorData.error?.message || "Failed to deactivate student"
        );
      }

      const result = await response.json();
      return NextResponse.json({
        success: true,
        message: "Student deactivated successfully",
        record: result.records[0],
      });
    }

    // Hard delete - actually remove the record
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        TABLE_NAME
      )}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to delete student");
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
      deleted: result.deleted,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}