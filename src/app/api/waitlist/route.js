// File: src/app/api/waitlist/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const TABLE_NAME = "Waitlist";

// Helper function to make Airtable API calls
async function makeAirtableRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Airtable API Error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  return response.json();
}

// GET - Retrieve all waitlist records
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const maxRecords = searchParams.get("maxRecords") || "100";
    const filterByFormula = searchParams.get("filterByFormula");
    const sort = searchParams.get("sort");

    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      TABLE_NAME
    )}?maxRecords=${maxRecords}`;

    if (filterByFormula) {
      url += `&filterByFormula=${encodeURIComponent(filterByFormula)}`;
    }

    if (sort) {
      url += `&sort=${encodeURIComponent(sort)}`;
    }

    const data = await makeAirtableRequest(url);

    return NextResponse.json({
      success: true,
      data: data.records,
      total: data.records.length,
      message: "Waitlist records retrieved successfully",
    });
  } catch (error) {
    console.error("GET Waitlist Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Update a specific waitlist record
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { recordId, fields } = body;

    if (!recordId) {
      return NextResponse.json(
        {
          success: false,
          error: "Record ID is required",
        },
        { status: 400 }
      );
    }

    if (!fields || typeof fields !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Fields object is required",
        },
        { status: 400 }
      );
    }

    // Validate Status field if provided
    const validStatuses = [
      "Contacted",
      "Active Student",
      "Inactive Student",
      "Not Interested",
      "Not Contacted",
    ];

    if (fields.Status && !validStatuses.includes(fields.Status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Valid options are: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      TABLE_NAME
    )}/${recordId}`;

    const updatedRecord = await makeAirtableRequest(url, {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    });

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("PATCH Waitlist Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new waitlist record
export async function POST(request) {
  try {
    const body = await request.json();
    const { fields } = body;

    if (!fields || typeof fields !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Fields object is required",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!fields["Email Address"]) {
      return NextResponse.json(
        {
          success: false,
          error: "Email Address is required",
        },
        { status: 400 }
      );
    }

    // Set default status if not provided
    if (!fields.Status) {
      fields.Status = "Not Contacted";
    }

    // Validate Status field
    const validStatuses = [
      "Contacted",
      "Active Student",
      "Inactive Student",
      "Not Interested",
      "Not Contacted",
    ];

    if (!validStatuses.includes(fields.Status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Valid options are: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      TABLE_NAME
    )}`;

    const newRecord = await makeAirtableRequest(url, {
      method: "POST",
      body: JSON.stringify({ fields }),
    });

    return NextResponse.json(
      {
        success: true,
        data: newRecord,
        message: "Record created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Waitlist Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a waitlist record
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get("recordId");

    if (!recordId) {
      return NextResponse.json(
        {
          success: false,
          error: "Record ID is required",
        },
        { status: 400 }
      );
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      TABLE_NAME
    )}/${recordId}`;

    await makeAirtableRequest(url, {
      method: "DELETE",
    });

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Waitlist Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
