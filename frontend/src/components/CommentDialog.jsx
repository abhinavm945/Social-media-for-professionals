/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import PostDialog from "./PostDialog";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import axios from "axios";

const CommentDialog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState(post.comments || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dialogRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Extract author safely
  const author =
    Array.isArray(post.author) && post.author.length > 0
      ? post.author[0]
      : null;

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        event.target.id !== "emoji-open"
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!open) return null; // Prevent rendering when closed

  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji) => {
    setText((prevText) => prevText + emoji.emoji);
  };

  const sendMessageHandler = async () => {
    if (!text.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const newComment = res.data.comment;

        // Update local state and global state
        const updatedComments = [newComment, ...comment];
        setComment(updatedComments);

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPosts));
        setText(""); // Clear input field
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("An error occurred while posting the comment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      {/* Dialog Box */}
      <div
        ref={dialogRef}
        className="bg-white p-0 rounded-lg shadow-lg max-w-5xl flex flex-col"
      >
        <div className="flex flex-1">
          {/* Left Side Image */}
          <div className="w-1/2">
            <img
              className="w-full h-full object-cover rounded-l-lg"
              src={post.image}
              alt="Post"
            />
          </div>

          {/* Right Side Comments Section */}
          <div className="w-1/2 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${author?.username}`}>
                  <Avatar size="xs" image={author?.profilePicture || ""} />
                </Link>
                <div>
                  <Link
                    to={`/profile/${author?.username}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {author?.username || "Unknown"}
                  </Link>
                </div>
              </div>
              <PostDialog />
            </div>
            <hr />

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-2">
              {comment.length > 0 ? (
                comment.map((c) => (
                  <div key={c._id} className="flex items-start gap-3">
                    {c.author ? (
                      <>
                        <Avatar
                          size="xs"
                          image={c.author?.profilePicture || ""}
                        />
                        <div>
                          <p className="font-semibold text-sm">
                            {c.author.username || "Unknown"}
                          </p>
                          <p className="text-gray-700">{c.text}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-gray-500 italic">
                          Comment by anonymous user
                        </p>
                        <p className="text-gray-700">{c.text}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-3 border-t border-gray-300">
              <div className="relative flex items-center gap-3">
                {/* Emoji Picker Button */}
                <GoSmiley
                  className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
                  title="Emoji"
                  id="emoji-open"
                  onClick={handleEmojiModal}
                />

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-12 left-10 z-40 shadow-lg rounded-lg"
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                  </div>
                )}

                {/* Text Input */}
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full outline-none border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                />

                {/* Post Button */}
                <button
                  type="submit"
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    text.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
