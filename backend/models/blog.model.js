import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blog: { type: String, defult: "" },
    author: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Blog", blogSchema);
