/* eslint-disable react/prop-types */
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Avatar from "./Avatar";
import BlogDialog from "./BlogDialog";
import BlogCommentDialog from "./BlogCommentDialog";
import { setBlogs } from "../redux/postSlice.js";
import { toast } from "react-toastify";
import { setUserProfile } from "../redux/authSlice.js";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { user, userProfile} = useSelector((store) => store.auth);
  const { blogs } = useSelector((store) => store.post);


  const author = blog?.author;

  // States
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(blog.likes.includes(user?._id) || false);
  const [loading, setLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(
    userProfile?.bookmarks?.some((bookmark) => bookmark._id === blog?._id) ||
      false
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim());
  };

  const LikeOrDisLikeHandler = async () => {
    if (!user) return toast.error("You need to be logged in to like blogs.");
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/${blog._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        const updatedBlogs = blogs.map((b) =>
          b._id === blog._id
            ? {
                ...b,
                likes: liked
                  ? b.likes.filter((id) => id !== user._id)
                  : [...b.likes, user._id],
              }
            : b
        );
        dispatch(setBlogs(updatedBlogs));
        if (userProfile && userProfile._id === blog.author[0]?._id) {
          const updatedUserBlogs = {
            ...userProfile,
            blogs: userProfile.blogs.map((p) =>
              p._id === blog._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserBlogs));
        }
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.", error);
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return toast.warning("Comment cannot be empty.");
    if (!user) return toast.error("You must be logged in to comment.");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/${blog._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedBlogs = blogs.map((p) =>
          p._id === blog._id
            ? { ...p, comments: [res.data.comment, ...p.comments] }
            : p
        );
        dispatch(setBlogs(updatedBlogs));

        if (userProfile && userProfile._id === blog.author[0]?._id) {
          const updatedUserBlogs = {
            ...userProfile,
            blogs: userProfile.blogs.map((p) =>
              p._id === blog._id
                ? { ...p, comments: [res.data.comment, ...p.comments] }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserBlogs));
        }
        setText("");
      } else {
        toast.error("Failed to Blog comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/blog/${blog?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setIsBookmark(res.data.type !== "unsaved");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-xxl mx-auto p-6 mb-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {author && (
                <>
                  <Avatar size={"xs"} image={author?.profilePicture} />
                  <h1 className="font-medium">{author?.username}</h1>
                </>
              )}
            </div>
            <BlogDialog blog={blog} />
          </div>

          {/* Blog Title */}
          <h2 className="text-lg font-semibold mt-2">{blog?.blogTitle}</h2>

          {/* Blog Description */}
          <div
            className="text-gray-700 my-2"
            dangerouslySetInnerHTML={{ __html: blog?.blogDiscription }}
          />

          {/* Blog Image/GIF */}
          {blog?.image && (
            <img
              src={blog?.image}
              alt="Blog"
              className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            />
          )}
          {blog?.gifUrl && (
            <img
              src={blog?.gifUrl}
              alt="Blog GIF"
              className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            />
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {liked ? (
                <FaHeart
                  size={"23px"}
                  className="cursor-pointer text-red-600 hover:text-gray-600"
                  onClick={LikeOrDisLikeHandler}
                />
              ) : (
                <FaRegHeart
                  size={"23px"}
                  className="cursor-pointer hover:text-gray-600"
                  onClick={LikeOrDisLikeHandler}
                />
              )}

              <MessageCircle
                onClick={() => setOpen(true)}
                className="cursor-pointer hover:text-gray-600"
              />
              <Send className="cursor-pointer hover:text-gray-600" />
            </div>
            {isBookmark ? (
              <BookmarkCheck
                onClick={bookmarkHandler}
                className="cursor-pointer hover:text-gray-600"
              />
            ) : (
              <Bookmark
                onClick={bookmarkHandler}
                className="cursor-pointer hover:text-gray-600"
              />
            )}
          </div>

          <span className="font-medium block my-2">
            {blog.likes.length} likes
          </span>

          {blog.comments.length > 0 && (
            <span
              onClick={() => setOpen(true)}
              className="cursor-pointer text-sm text-gray-600"
            >
              View all {blog.comments.length} comments
            </span>
          )}
          {/* Add Comment */}
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={changeEventHandler}
              className="outline-none text-sm w-full"
            />
            {text && (
              <span
                onClick={commentHandler}
                className="text-[#3badf8] cursor-pointer"
              >
                Post
              </span>
            )}
          </div>

          <BlogCommentDialog open={open} setOpen={setOpen} blog={blog} />
        </>
      )}
    </div>
  );
};

export default Blog;
