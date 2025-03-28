import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { UserEvent } from "@/models/UserEvent";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event, status } = await req.json();

    await connectDB();

    const userEvent = await UserEvent.findOneAndUpdate(
      { userId: session.userId, "event.id": event.id },
      { userId: session.userId, event, status },
      { upsert: true, new: true }
    );

    return NextResponse.json(userEvent);
  } catch (error) {
    console.error("Error in POST /api/user-events:", error);
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

    await connectDB();

    const userEvents = await UserEvent.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(userEvents);
  } catch (error) {
    console.error("Error in GET /api/user-events:", error);
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

    const { eventId } = await req.json();

    await connectDB();

    await UserEvent.findOneAndDelete({
      userId: session.userId,
      "event.id": eventId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/user-events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
