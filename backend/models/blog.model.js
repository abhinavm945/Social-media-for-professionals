import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogTitle: { type: String, default: "" },
    blogDiscription: { type: String, default: "" },
    image: { type: String }, // Make image optional
    gifUrl: { type: String }, // Add gifUrl field
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Change to single reference
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
