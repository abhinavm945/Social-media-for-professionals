/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import Avatar from "./Avatar";
import { TbPhotoVideo } from "react-icons/tb";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Toast from "./Toast";
import { setPosts } from "../redux/postSlice.js";
import { setUserProfile } from "../redux/authSlice.js";

const CreatePostDialog = ({ open, setOpen }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const [toast, setToast] = useState(null);
  const dialogRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        if (file) {
          setShowDiscardPopup(true);
        } else {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, file]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const fileChangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleEmojiClick = (emoji) => {
    setCaption((prevCaption) => prevCaption + emoji.emoji);
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setToast({ message: res.data.success, type: "success" });
        dispatch(setPosts([res.data.post, ...posts]));
        setCaption("");
        setFile(null);
        setImagePreview(null);
        setOpen(false);
        setTimeout(() => setToast(null), 3000);
        if (userProfile && userProfile._id === user?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: [res.data.post, ...(userProfile?.posts ?? [])],
          };
          dispatch(setUserProfile(updatedUserPosts));
        }
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

  const discardPost = () => {
    setShowDiscardPopup(false);
    setFile(null);
    setImagePreview(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-[800px]">
        <h2 className="text-md text-white text-center p-2 bg-black rounded-t-lg">
          Create new post
        </h2>
        {!imagePreview ? (
          <div className="flex flex-col items-center justify-center p-15 rounded-lg">
            <TbPhotoVideo
              className="size-35 mb-13"
              style={{ strokeWidth: "0.5" }}
            />
            <p className="text-gray-500 font-semibold">
              Drag photos and videos here
            </p>
            <label className="mt-3 bg-black text-white px-4 py-2 rounded cursor-pointer">
              Select from computer
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={fileChangeHandler}
              />
            </label>
          </div>
        ) : (
          <div className="flex">
            <div className="w-1/2 flex items-center justify-center border-r">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
            <div className="w-1/2 p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" image={user.profilePicture} />
                  <div>
                    <h1 className="font-semibold text-sm">{user?.username}</h1>
                    <span className="text-xs text-gray-500">{user?.bio}</span>
                  </div>
                </div>
                <button
                  onClick={handlePostSubmit}
                  disabled={!caption.trim() || loading}
                  className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400 hover:cursor-pointer"
                >
                  {loading ? "Posting..." : "Share"}
                </button>
              </div>
              <div className="relative w-full flex items-center border-b border-b-gray-300 p-2 mt-4">
                <GoSmiley
                  className="text-2xl top-0 cursor-pointer"
                  id="emoji-open"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full resize-none h-24 outline-none"
                />
                {showEmojiPicker && (
                  <div
                    className="absolute top-0 left-97 z-40"
                    ref={emojiPickerRef}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showDiscardPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
            <div className="bg-white rounded-lg shadow-lg w-[350px] text-center">
              <h3 className="pt-5 text-lg font-semibold mb-2">Discard post?</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you leave, your edits would not be saved.
              </p>
              <div className="border-y border-gray-300">
                <button
                  className="w-full text-red-500 px-4 py-2 rounded"
                  onClick={discardPost}
                >
                  Discard
                </button>
              </div>
              <div>
                <button
                  className="w-full text-black px-4 py-2 rounded"
                  onClick={() => setShowDiscardPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostDialog;
