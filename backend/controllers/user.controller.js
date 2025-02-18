import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utlis/datauri.js";
import cloudinary from "../utlis/coludinary.js";
import { Post } from "../models/post.model.js";

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
    
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
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
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
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
      await cloudinary.uploader.upload(fileUri);
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
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

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
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const loggedInUserId = req.user._id; // Correctly get the logged-in user's ID

    const suggestedUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(200).json({
        success: true,
        users: [],
        message: "No suggested users available",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.user.id;
    const jiskoFollowKrunga = req.params.id;
    if (followKrneWala == jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot Folloe/Unfollow Yourself",
        success: false,
      });
    }
    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(jiskoFollowKrunga);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { following: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { following: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
