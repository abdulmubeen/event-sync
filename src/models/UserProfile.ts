import mongoose, { Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: string;
  username: string;
  bio?: string;
  avatar?: string;
  interests: string[];
  following: string[]; // Array of userIds
  followers: string[]; // Array of userIds
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new mongoose.Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    avatar: { type: String },
    interests: [{ type: String }],
    following: [{ type: String }],
    followers: [{ type: String }],
    socialLinks: {
      twitter: String,
      instagram: String,
      facebook: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);
