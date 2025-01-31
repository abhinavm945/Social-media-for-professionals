import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Image required",
      });
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg; base64, ${
      (optimizedImageBuffer, toString("base64"))
    }`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post added",
      success: true,
      post,
    });
  } catch (error) {
    console.log(erroe);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "auther",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "auther",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKarnewalaUserId = req.is;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    //like logic
    await post.updateOne({ $addToSet: { likes: likeKarnewalaUserId } });
    await post.save();

    // implement socket io for real time notifications
    return res.status(200).json({ message: "Post liked4", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKarnewalaUserId = req.is;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    //like logic
    await post.updateOne({ $pull: { likes: likeKarnewalaUserId } });
    await post.save();

    // implement socket io for real time notifications
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentkrnewaleUserId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (text) {
      return res.status(400).json({
        message: "text is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: commentkrnewaleUserId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username, profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();
    return res.status(200).json({ message: "comment added", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username, profilePicture"
    );
    if (!comments) {
      return req
        .status(404)
        .json({ message: "No comments found for this post}", success: false });
    }
    return res
      .status(200)
      .json({ message: "comments retrived", success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return req.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    //user authicated
    if (post.author.toString !== authorId) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    //delete post
    await Post.findByIdAndDelete(postId);

    //remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() != postId);
    user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "Post remove form bookmark",
          success: true,
        });
    } else {
      // bookmark post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
