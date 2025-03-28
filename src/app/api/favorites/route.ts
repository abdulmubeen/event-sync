import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { FavoriteEvent } from "@/models/FavoriteEvent";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { event } = await req.json();
    await connectDB();

    const favorite = await FavoriteEvent.create({
      userId: session.userId,
      event,
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("[FAVORITES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const favorites = await FavoriteEvent.find({ userId: session.userId });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("[FAVORITES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId } = await req.json();
    await connectDB();

    await FavoriteEvent.deleteOne({
      userId: session.userId,
      "event.id": eventId,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FAVORITES_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
