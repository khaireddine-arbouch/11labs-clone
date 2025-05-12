import { NextRequest, NextResponse } from "next/server";
import { getHistoryItems } from "~/lib/history";
import type { ServiceType } from "~/types/services";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { deleteFileFromS3 } from "~/lib/s3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const service = searchParams.get("service") as ServiceType;

  if (!service) {
    return NextResponse.json({ error: "Service parameter is required" }, { status: 400 });
  }

  try {
    const historyItems = await getHistoryItems(service);
    return NextResponse.json(historyItems);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clipId = searchParams.get("id");

  if (!clipId) {
    return NextResponse.json({ error: "Audio clip ID is required" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First get the clip to check ownership and get S3 key
    const clip = await db.generatedAudioClip.findUnique({
      where: {
        id: clipId,
        userId: session.user.id,
      },
      select: {
        id: true,
        s3Key: true,
      },
    });

    if (!clip) {
      return NextResponse.json({ error: "Audio clip not found" }, { status: 404 });
    }

    // Delete the file from S3 if it exists
    if (clip.s3Key) {
      try {
        await deleteFileFromS3(clip.s3Key);
      } catch (s3Error) {
        console.error("Error deleting file from S3:", s3Error);
        // Continue with DB deletion even if S3 deletion fails
      }
    }

    // Delete the clip record from the database
    await db.generatedAudioClip.delete({
      where: {
        id: clipId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting history item:", error);
    return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
  }
} 