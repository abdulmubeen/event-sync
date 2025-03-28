import mongoose, { Document } from "mongoose";
import { Event } from "@/components/event-card/event-card";

export interface IUserEvent extends Document {
  userId: string;
  event: Event;
  status: "going" | "interested";
  createdAt: Date;
}

const userEventSchema = new mongoose.Schema<IUserEvent>(
  {
    userId: { type: String, required: true },
    event: { type: Object, required: true },
    status: { type: String, enum: ["going", "interested"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can't have duplicate events
userEventSchema.index({ userId: 1, "event.id": 1 }, { unique: true });

export const UserEvent =
  mongoose.models.UserEvent ||
  mongoose.model<IUserEvent>("UserEvent", userEventSchema);
