/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { TbX } from "react-icons/tb";
import { ImAttachment } from "react-icons/im";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "./Toast";
import Avatar from "./Avatar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import { GiphyFetch } from "@giphy/js-fetch-api";

const CreateBlogDialog = ({ createBlog, setCreateBlog }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState([]);
  const dialogRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const gifPickerRef = useRef(null);
  const { user } = useSelector((store) => store.auth);

  const giphyFetch = new GiphyFetch("HgUrfU1ytCEXvrPP3ZW7iSi86LDJXhzD"); // Replace with your Giphy API key

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setCreateBlog(false);
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target)
      ) {
        setShowGifPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setCreateBlog]);

  // Fetch trending GIFs when the GIF picker is opened
  useEffect(() => {
    if (showGifPicker) {
      fetchGifs("trending");
    }
  }, [showGifPicker]);

  const fileChangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleEmojiClick = (emoji) => {
    setBlogDescription((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const fetchGifs = async (query) => {
    const { data } = await giphyFetch.search(query, { limit: 10 });
    setGifs(data);
  };

  const handleGifClick = (gif) => {
    setFile(null); // Clear any selected image
    setImagePreview(gif.images.original.url); // Set GIF as preview
    setShowGifPicker(false);
  };

  const removeMedia = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleBlogSubmit = async () => {
    if (!blogTitle.trim() || !blogDescription.trim()) {
      setToast({
        message: "Title and description are required",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("blogTitle", blogTitle);
    formData.append("blogDiscription", blogDescription);

    if (file) {
      formData.append("image", file); // Append image file
    } else if (imagePreview) {
      formData.append("gifUrl", imagePreview); // Append GIF URL
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/blog/addblog",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setToast({ message: res.data.message, type: "success" });
        setBlogTitle("");
        setBlogDescription("");
        setFile(null);
        setImagePreview(null);
        setCreateBlog(false);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!createBlog) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-[800px] mx-4 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create New Blog</h2>
          <button
            onClick={() => setCreateBlog(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar size="sm" image={user.profilePicture} />
            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-xs text-gray-500">{user?.bio}</span>
            </div>
          </div>

          {/* Blog Title */}
          <input
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog Title..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Blog Description */}
          <div className="mb-4">
            <ReactQuill
              value={blogDescription}
              onChange={setBlogDescription}
              placeholder="Blog Description..."
              modules={{
                toolbar: [
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                ],
              }}
              className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-black"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            />
          </div>

{/* Action Buttons */}
<div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowGifPicker(false); // Close GIF picker when emoji picker opens
              }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              😊
            </button>
            <button
              onClick={() => {
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false); // Close emoji picker when GIF picker opens
              }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              GIF
            </button>
            <label className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
              <ImAttachment className="inline" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={fileChangeHandler}
                disabled={!!imagePreview} // Disable if a GIF is selected
              />
            </label>
          </div>

          {/* Media Preview */}
          {imagePreview && (
            <div className="mb-4 relative group flex justify-center">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-[50%] h-auto rounded-lg"
              />
              <button
                onClick={removeMedia}
                className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>
          )}

          

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="fixed z-50 bg-white p-4 rounded-lg shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* GIF Picker */}
          {showGifPicker && (
            <div
              ref={gifPickerRef}
              className="fixed z-50 bg-white p-4 rounded-lg shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "300px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <input
                type="text"
                placeholder="Search GIFs"
                onChange={(e) => fetchGifs(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="grid grid-cols-2 gap-2">
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.images.original.url}
                    alt="GIF"
                    className="cursor-pointer rounded-lg"
                    onClick={() => handleGifClick(gif)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleBlogSubmit}
            disabled={!blogTitle.trim() || !blogDescription.trim() || loading}
            className="w-full bg-black text-white py-3 rounded-lg disabled:bg-gray-400 hover:bg-gray-800 transition-colors"
          >
            {loading ? "Posting..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogDialog;
