// File: src/app/api/blog/route.js
import { NextResponse } from "next/server";

// Field mappings (can switch between names and IDs)
const FIELDS = {
  TITLE: "Title", // or flds3PtCpuld3XVwJ
  CATEGORY: "Category", // or fldVIGbHKZGP9VppE
  DESCRIPTION: "Description", // or fldtwgYJPWaPHsz3h
  DATE_PUBLISHED: "Date Published", // or fldn89wl3D1tIUoHT
  DATE_EDITED: "Date Edited (Optional)", // or fldIarsqy5cebcfnQ
  AUTHOR: "Author", // or flddrXrSU0kmO1iI7
  CONTENT: "Content", // or fldK9Fz1gm08sgQyx
};

// Updated valid categories for the blog
// const VALID_CATEGORIES = ["Grammar", "Vocabulary"];

export async function POST(req) {
  try {
    const data = await req.json();
    const baseId = process.env.AIRTABLE_BASE_ID;

    // // Validate category if provided
    // if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(
    //         ", "
    //       )}`,
    //     },
    //     { status: 400 }
    //   );
    // }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/BlogPosts`,
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
                [FIELDS.TITLE]: data.title,
                [FIELDS.CATEGORY]: data.category,
                [FIELDS.DESCRIPTION]: data.description,
                [FIELDS.DATE_PUBLISHED]:
                  data.datePublished || new Date().toISOString().split("T")[0],
                [FIELDS.DATE_EDITED]: data.dateEdited || "",
                [FIELDS.AUTHOR]: data.author || "Moeno", // Default author
                [FIELDS.CONTENT]: data.content,
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
      throw new Error(errorData.error?.message || "Failed to create record");
    }

    const result = await response.json();
    return NextResponse.json({ success: true, record: result.records[0] });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/BlogPosts?sort%5B0%5D%5Bfield%5D=Date%20Published&sort%5B0%5D%5Bdirection%5D=desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded. Please try again in 30 seconds.",
          },
          { status: 429 }
        );
      }
      throw new Error(errorData.error?.message || "Failed to fetch blog posts");
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: data.records,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
