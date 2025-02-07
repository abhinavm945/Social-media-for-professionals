/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toast from "./Toast";
import axios from "axios";
import { setPosts } from "../redux/postSlice.js";

function PostDialog({ isFollowing, onFollowToggle, post }) {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();

  const dialogRef = useRef(null);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const author = post?.author?.[0] || null;

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

  const handleFollowToggle = () => {
    setFollowing(!following);
    if (onFollowToggle) {
      onFollowToggle(!following);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ Update Redux store
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));

        // ✅ Show success toast
        setToast({
          message: res.data.message || "Post Deleted Successfully",
          type: "success",
        });

        // ✅ Close modal AFTER toast disappears
        setTimeout(() => {
          setToast(null);
        }, 2000);

        setTimeout(() => {
          setOpen(false);
        }, 2500); // Close dialog after toast fades
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });

      setTimeout(() => {
        setToast(null);
      }, 2000);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <button
        onClick={() => setOpen(true)}
        className=" font-bold text-lg hover:text-gray-500 cursor-pointer "
      >
        <div className="mr-2 text-xl ">...</div>
      </button>

      {/* Dialog Box Overlay */}

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          {toast && <Toast message={toast.message} type={toast.type} />}
          {/* Dialog Content */}
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-80  ">
            {user && user?._id !== author._id && (
              <button
                onClick={handleFollowToggle}
                className={`w-full py-2 rounded-t-lg border-b border-gray-300 hover:cursor-pointer ${
                  following
                    ? "bg-white text-red-500 hover:bg-gray-300"
                    : " text-blue-600 bg-white hover:bg-gray-300"
                }`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            )}

            {user && user?._id === author._id && (
              <button
                onClick={deletePostHandler}
                className=" w-full text-red-600 py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
              >
                Delete
              </button>
            )}

            <button
              onClick={() => setOpen(false)}
              className=" w-full py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
            >
              Add to favourites
            </button>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 bg-white hover:bg-gray-300 rounded-b-lg border-b border-gray-300 hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PostDialog;
