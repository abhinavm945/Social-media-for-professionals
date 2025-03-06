/* eslint-disable react/prop-types */
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Avatar from "./Avatar";
import PostDialog from "./PostDialog";
import CommentDialog from "./CommentDialog";
import { setPosts } from "../redux/postSlice.js";
import { toast } from "react-toastify";
import { setUserProfile } from "../redux/authSlice.js";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const { userProfile } = useSelector((store) => store.auth);

  const author = post?.author;

  // States
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [loading, setLoading] = useState(true); // 🔄 Add loading state
  const [isBookmark, setIsBookmark] = useState(
    userProfile?.bookmarkPosts?.some((bookmark) => bookmark._id === post?._id) ||
      false
  );

  useEffect(() => {
    // Simulate fetching delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const LikeOrDisLikeHandler = async () => {
    if (!user) return toast.error("You need to be logged in to like posts.");

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(!liked);

        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPosts));

        if (userProfile && userProfile._id === post.author?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: userProfile.posts.map((p) =>
              p._id === post._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserPosts));
        }
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.");
      console.log(error);
    }
  };

  const commentHandler = async () => {
    const text = text.trim();
    if (!text.trim()) return toast.warning("Comment cannot be empty.");
    if (!user) return toast.error("You must be logged in to comment.");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [res.data.comment, ...p.comments] }
            : p
        );
        dispatch(setPosts(updatedPosts));

        if (userProfile && userProfile._id === post.author?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: userProfile.posts.map((p) =>
              p._id === post._id
                ? { ...p, comments: [res.data.comment, ...p.comments] }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserPosts));
        }

        setText("");
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
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
    <div className="w-full max-w-lg mx-auto  p-6 mb-6">
      {loading ? (
        // 🔄 Loader (Replace with a better spinner if needed)
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Post Header */}
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${author?._id}`}
              className="flex items-center gap-2"
            >
              {author && (
                <>
                  <Avatar size={"xs"} image={author?.profilePicture} />

                  <h1 className="font-medium">{author?.username}</h1>
                </>
              )}
            </Link>
            <PostDialog
              isFollowing={userProfile?.followers.includes(user?._id)}
              post={post}
            />
          </div>

          {/* Post Image */}
          {post.image && (
            <img
              className="rounded-sm my-2 aspect-square object-cover"
              src={post.image}
              alt="Post"
            />
          )}

          {/* Post Actions */}
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

          {/* Likes Count */}
          <span className="font-medium block my-2">
            {post.likes.length} likes
          </span>

          {/* Post Caption */}
          <p>
            <span className="font-medium mr-2">
              {author?.username || "Unknown"}
            </span>
            {post.caption}
          </p>

          {/* Comments Section */}
          {post.comments.length > 0 && (
            <span
              onClick={() => setOpen(true)}
              className="cursor-pointer text-sm text-gray-600"
            >
              View all {post.comments.length} comments
            </span>
          )}

          <CommentDialog
            open={open}
            setOpen={setOpen}
            post={post}
          />

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
        </>
      )}
    </div>
  );
};

export default Post;
