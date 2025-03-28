import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { SocialInteraction } from "@/models/SocialInteraction";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, type, content } = await req.json();
    await connectDB();

    const interaction = await SocialInteraction.findOneAndUpdate(
      { userId: session.userId, eventId, type },
      { userId: session.userId, eventId, type, content },
      { upsert: true, new: true }
    );

    return NextResponse.json(interaction);
  } catch (error) {
    console.error("Error in POST /api/social/interactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const type = searchParams.get("type");

    await connectDB();

    const query: any = { eventId };
    if (type) {
      query.type = type;
    }

    const interactions = await SocialInteraction.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(interactions);
  } catch (error) {
    console.error("Error in GET /api/social/interactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, type } = await req.json();
    await connectDB();

    await SocialInteraction.findOneAndDelete({
      userId: session.userId,
      eventId,
      type,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/social/interactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
