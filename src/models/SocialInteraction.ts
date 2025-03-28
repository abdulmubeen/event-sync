import mongoose, { Document } from "mongoose";

export interface ISocialInteraction extends Document {
  userId: string;
  eventId: string;
  type: "like" | "comment" | "share";
  content?: string; // For comments
  createdAt: Date;
  updatedAt: Date;
}

const socialInteractionSchema = new mongoose.Schema<ISocialInteraction>(
  {
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    type: { type: String, enum: ["like", "comment", "share"], required: true },
    content: { type: String }, // For comments
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can't have duplicate interactions of the same type for an event
socialInteractionSchema.index(
  { userId: 1, eventId: 1, type: 1 },
  { unique: true }
);

export const SocialInteraction =
  mongoose.models.SocialInteraction ||
  mongoose.model<ISocialInteraction>(
    "SocialInteraction",
    socialInteractionSchema
  );
