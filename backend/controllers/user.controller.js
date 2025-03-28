import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utlis/datauri.js";
import cloudinary from "../utlis/coludinary.js";
import { Post } from "../models/post.model.js";
import { Blog } from "../models/blog.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing in the form",
        success: false,
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (user) {
      return res.status(401).json({
        message: "This email or username is already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(401).json({
        message: "Something is missing in the form",
        success: false,
      });
    }
    let user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email/username or password",
        success: false,
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //populate each post id in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);

        if (!post) {
          return null; // Handle case where post does not exist
        }

        // Ensure post.author is an ObjectId before calling `.equals()`
        if (post.author && post.author.toString() === user._id.toString()) {
          return post;
        }

        return null;
      })
    );

    const populatedBlogs = await Promise.all(
      user.blogs.map(async (blogId) => {
        const blog = await Blog.findById(blogId);

        if (!blog) {
          return null; // Handle case where post does not exist
        }

        // Ensure blog.author is an ObjectId before calling `.equals()`
        if (blog.author && blog.author.toString() === user._id.toString()) {
          return blog;
        }

        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
      blogs: populatedBlogs,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 10000,
      })
      .json({
        message: `welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (__dirname, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user and populate the posts, blogs, bookmarkPosts, and bookmarkBlogs
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        populate: [
          {
            path: "author",
            select: "username profilePicture",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } }, // Sort comments by latest
            populate: {
              path: "author",
              select: "username profilePicture",
            },
          },
        ],
        options: { sort: { createdAt: -1 } }, // Sort posts by latest
      })
      .populate({
        path: "blogs",
        populate: [
          {
            path: "author",
            select: "username profilePicture",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } }, // Sort comments by latest
            populate: {
              path: "author",
              select: "username profilePicture",
            },
          },
        ],
        options: { sort: { createdAt: -1 } }, // Sort blogs by latest
      })
      .populate({
        path: "bookmarkPosts",
        populate: [
          {
            path: "author",
            select: "username profilePicture",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } }, // Sort comments by latest
            populate: {
              path: "author",
              select: "username profilePicture",
            },
          },
        ],
      })
      .populate({
        path: "bookmarkBlogs",
        populate: [
          {
            path: "author",
            select: "username profilePicture",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } }, // Sort comments by latest
            populate: {
              path: "author",
              select: "username profilePicture",
            },
          },
        ],
      })
      .select("-password"); // Exclude the password field

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse?.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get logged-in user's ID from req.user.id
    const loggedInUserId = req.user.id; // Use req.user.id (not req.user._id)

    // Fetch suggested users (excluding the logged-in user)
    const suggestedUsers = await User.find({
      _id: { $ne: loggedInUserId }, // Exclude the logged-in user
    }).select("-password"); // Exclude the password field

    // Handle empty results
    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(200).json({
        success: true,
        users: [],
        message: "No suggested users available",
      });
    }

    // Return suggested users
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
      message: "Suggested users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message, // Include the error message for debugging
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.user.id; // Logged-in user (follower)
    const jiskoFollowKrunga = req.params.id; // User to follow/unfollow (target user)

    // Check if the user is trying to follow/unfollow themselves
    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    // Find the logged-in user and the target user
    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    // Check if both users exist
    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the logged-in user is already following the target user
    const isFollowing = user.following.includes(jiskoFollowKrunga);

    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        // Remove the target user from the logged-in user's `following` list
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        // Remove the logged-in user from the target user's `followers` list
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      // Follow logic
      await Promise.all([
        // Add the target user to the logged-in user's `following` list
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        // Add the logged-in user to the target user's `followers` list
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error in followOrUnfollow:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
