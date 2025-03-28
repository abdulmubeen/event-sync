import mongoose, { Document } from "mongoose";
import { Event } from "@/components/event-card/event-card";

export interface IFavoriteEvent extends Document {
  userId: string;
  event: Event;
  createdAt: Date;
}

const favoriteEventSchema = new mongoose.Schema<IFavoriteEvent>({
  userId: {
    type: String,
    required: true,
  },
  event: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FavoriteEvent =
  mongoose.models.FavoriteEvent ||
  mongoose.model<IFavoriteEvent>("FavoriteEvent", favoriteEventSchema);
