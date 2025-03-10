// File: src/app/api/blog/[id]/route.js
import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const postId = params.id;

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/BlogPosts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: "Blog post not found",
          },
          { status: 404 }
        );
      }

      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch blog post");
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
