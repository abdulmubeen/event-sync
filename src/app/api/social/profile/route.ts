import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { UserProfile } from "@/models/UserProfile";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const profile = await UserProfile.findOne({ userId: session.userId });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in GET /api/social/profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const profile = await UserProfile.findOneAndUpdate(
      { userId: session.userId },
      {
        userId: session.userId,
        username: data.username,
        bio: data.bio,
        avatar: data.avatar,
        interests: data.interests,
        socialLinks: data.socialLinks,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in POST /api/social/profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const profile = await UserProfile.findOneAndUpdate(
      { userId: session.userId },
      { $set: data },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in PUT /api/social/profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
