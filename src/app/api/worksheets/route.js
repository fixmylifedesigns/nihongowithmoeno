// File: src/app/api/worksheets/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const TABLE_NAME = "Worksheets";

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

// GET - Retrieve all worksheet records
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
      message: "Worksheet records retrieved successfully",
    });
  } catch (error) {
    console.error("GET Worksheets Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new worksheet record
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
    if (!fields.Title) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    // Set default Date Created if not provided
    if (!fields["Date Created"]) {
      fields["Date Created"] = new Date().toISOString().split("T")[0];
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
        message: "Worksheet record created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Worksheets Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Update a specific worksheet record
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
      message: "Worksheet record updated successfully",
    });
  } catch (error) {
    console.error("PATCH Worksheets Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a worksheet record
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
      message: "Worksheet record deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Worksheets Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}