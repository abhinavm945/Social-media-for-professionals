/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "./Avatar";
import BlogDialog from "./BlogDialog";

const Blog = ({ blog }) => {
  const { user } = useSelector((store) => store.auth);
  const [liked, setLiked] = useState(blog?.likes?.includes(user?._id) || false); // Add optional chaining
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks?.some((bookmark) => bookmark._id === blog?._id) || false // Add optional chaining
  );

  const author = blog?.author;

  // Handle like/dislike
  const handleLike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/${blog._id}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(!liked);
        toast.success(`Blog ${action}d successfully!`);
      }
    } catch (error) {
      toast.error("Failed to update like status.");
      console.error(error);
    }
  };

  // Handle bookmark
  const handleBookmark = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/blog/${blog._id}/bookmark`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsBookmarked(res.data.type === "saved");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update bookmark.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mb-6 ">
      {/* Blog Author */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar size="sm" image={author?.profilePicture} />
        <div>
          <h1 className="font-semibold text-sm">{author?.username}</h1>
          <span className="text-xs text-gray-500">{author?.bio}</span>
        </div>
        <BlogDialog blog={blog} />
      </div>

      {/* Blog Title */}
      <h2 className="text-xl font-bold mb-2">{blog?.blogTitle}</h2>

      {/* Blog Description */}
      <div
        className="text-gray-700 mb-4 blog-content" // Add a class for styling
        dangerouslySetInnerHTML={{ __html: blog?.blogDiscription }}
      />

      {/* Media (Image or GIF) */}
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

      {/* Blog Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-2">
            {liked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
            <span>{blog?.likes.length}</span>
          </button>
          <button className="flex items-center gap-2">
            <FaComment className="text-gray-600" />
            <span>{blog?.comments.length}</span>
          </button>
        </div>
        <button onClick={handleBookmark}>
          {isBookmarked ? (
            <FaBookmark className="text-gray-600" />
          ) : (
            <FaRegBookmark className="text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Blog;