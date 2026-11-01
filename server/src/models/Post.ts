import mongoose, { type Document, type Types } from "mongoose";

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPost>("Post", postSchema);
