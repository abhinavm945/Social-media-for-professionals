import sharp from "sharp";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utlis/coludinary.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const addNewBlog = async (req, res) => {
  try {
    const { blogTitle, blogDiscription, gifUrl } = req.body;
    const image = req.file; // This will be undefined if no image is uploaded
    const authorId = req.user.id;

    let imageUrl = null;

    // Handle image upload
    if (image && image.buffer) {
      // Optimize image using Sharp
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: "inside",
        })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      // Convert buffer to Base64 string
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "blogs", // Optional: Store images in a specific folder
      });

      imageUrl = cloudResponse.secure_url;
    }

    // Save blog in the database
    const newBlog = await Blog.create({
      blogTitle,
      blogDiscription,
      image: imageUrl, // Will be null if no image is uploaded
      gifUrl: gifUrl || null, // Will be null if no GIF URL is provided
      author: authorId,
    });

    // Add blog to user's profile
    const user = await User.findById(authorId);
    if (user) {
      user.blogs.push(newBlog._id);

      // Clean up invalid bookmarkBlogs (if any)
      user.bookmarkBlogs = user.bookmarkBlogs.filter(
        (bookmark) => bookmark.type && bookmark.refId
      );

      await user.save();
    }

    // Populate author details (excluding password)
    await newBlog.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New blog added",
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error in addNewBlog:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .populate({ path: "author", select: "username profilePicture" }) // Populate author details
      .populate({
        path: "comments",
        sort: { createdAt: -1 }, // Sort comments by creation date (newest first)
        populate: {
          path: "author",
          select: "username profilePicture", // Populate comment author details
        },
      });

    return res.status(200).json({
      blogs,
      success: true,
    });
  } catch (error) {
    console.error("Error in getAllBlog:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getUserBlog = async (req, res) => {
  try {
    const authorId = req.user.id;
    const blogs = await Blog.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      blogs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likeBlog = async (req, res) => {
  try {
    const likeKarnewalaUserId = req.user.id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "blog not found", success: false });
    }
    //like logic
    await blog.updateOne({ $addToSet: { likes: likeKarnewalaUserId } });
    await blog.save();

    // implement socket io for real time notifications
    const user = await User.findById(likeKarnewalaUserId).select(
      "username profilePicture"
    );
    const blogOwnerId = blog.author.toString();
    if (blogOwnerId !== likeKarnewalaUserId) {
      // emit notification event
      const notification = {
        type: "like",
        userId: likeKarnewalaUserId,
        userDetails: user,
        blogId,
        message: "Your blog was liked",
      };
      const blogOwnerSocketId = getReceiverSocketId(blogOwnerId);
      io.to(blogOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "blog liked4", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikeBlog = async (req, res) => {
  try {
    const likeKarnewalaUserId = req.user.id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "blog not found", success: false });
    }
    //like logic
    await blog.updateOne({ $pull: { likes: likeKarnewalaUserId } });
    await blog.save();

    // implement socket io for real time notifications
    const user = await User.findById(likeKarnewalaUserId).select(
      "username profilePicture"
    );
    const blogOwnerId = blog.author.toString();
    if (blogOwnerId !== likeKarnewalaUserId) {
      // emit notification event
      const notification = {
        type: "dislike",
        userId: likeKarnewalaUserId,
        userDetails: user,
        blogId,
        message: "Your blog was liked",
      };
      const blogOwnerSocketId = getReceiverSocketId(blogOwnerId);
      io.to(blogOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Comment added", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addCommenttoBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const commentkrnewaleUserId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "text is required",
        success: false,
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "blog not found", success: false });
    }

    const comment = await Comment.create({
      text,
      author: commentkrnewaleUserId,
      blog: blogId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    blog.comments.push(comment._id);
    await blog.save();

    return res
      .status(200)
      .json({ message: "Comment added", success: true, comment });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getCommentsOfBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const comments = await Comment.find({ blog: blogId }).populate(
      "author",
      "username profilePicture"
    );
    if (!comments) {
      return req
        .status(404)
        .json({ message: "No comments found for this blog}", success: false });
    }
    return res
      .status(200)
      .json({ message: "comments retrived", success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user.id; // ✅ Correct way to access user ID

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "blog not found",
        success: false,
      });
    }

    // Ensure the user is authorized
    if (blog.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(blogId);

    // Remove the blog ID from the user's blog list
    const user = await User.findById(authorId);
    user.blogs = user.blogs.filter((id) => id.toString() !== blogId);
    await user.save();

    // Delete associated comments
    await Comment.deleteMany({ blog: blogId });

    return res
      .status(200)
      .json({ message: "blog deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const bookmarkBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user.id;

    // Find the blog and populate author and comments
    const blog = await Blog.findById(blogId)
      .populate({
        path: "author",
        select: "username profilePicture", // Select only necessary fields
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 }, // Sort comments by creation date
        populate: {
          path: "author",
          select: "username profilePicture", // Select only necessary fields
        },
      });

    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }

    const user = await User.findById(authorId);

    if (user.bookmarkBlogs.includes(blog._id)) {
      // Already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarkBlogs: blog._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Blog removed from bookmark",
        success: true,
        blog, // Return the populated blog
      });
    } else {
      // Bookmark blog
      await user.updateOne({ $addToSet: { bookmarkBlogs: blog._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Blog bookmarked",
        success: true,
        blog, // Return the populated blog
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
