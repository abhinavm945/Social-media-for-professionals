/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setBlogs } from "../redux/postSlice.js";
import { setUserProfile, setSuggestedUsers } from "../redux/authSlice.js";

function BlogDialog({ blog }) {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dispatch = useDispatch();

  const dialogRef = useRef(null);
  const { user, userProfile, suggestedUsers } = useSelector((store) => store.auth);
  const { blogs } = useSelector((store) => store.post);
  const author = blog?.author || null;

  // Check if the logged-in user is following the blog author
  const isFollowing = author ? userProfile?.followers.includes(author._id) : false;
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing); // Sync state when props change
  }, [isFollowing]);

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
  }, [open]);

  /** Follow/Unfollow Handler */
  const handleFollowToggle = async () => {
    if (!author) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${author._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const isFollowingNow = !following;
        setFollowing(isFollowingNow);
        setToastMessage({ message: res.data.message, type: "success" });

        // Update `userProfile` if logged-in user is performing the action
        if (user._id === userProfile._id) {
          const updatedUserProfile = {
            ...userProfile,
            following: isFollowingNow
              ? [...userProfile.following, author._id]
              : userProfile.following.filter((id) => id !== author._id),
          };
          dispatch(setUserProfile(updatedUserProfile));
        }

        // Update `suggestedUsers` list
        const updatedSuggestedUsers = suggestedUsers.map((userItem) =>
          userItem._id === author._id
            ? {
                ...userItem,
                followers: isFollowingNow
                  ? [...userItem.followers, user._id]
                  : userItem.followers.filter((id) => id !== user._id),
              }
            : userItem
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers));

        // Update `userProfile.followers` if the logged-in user is viewing the author's profile
        if (userProfile._id === author._id) {
          const updatedProfile = {
            ...userProfile,
            followers: isFollowingNow
              ? [...userProfile.followers, user._id]
              : userProfile.followers.filter((id) => id !== user._id),
          };
          dispatch(setUserProfile(updatedProfile));
        }

        // Hide toast after a few seconds
        setTimeout(() => setToastMessage(null), 2000);
      }
    } catch (error) {
      setToastMessage({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  /** Blog Deletion Handler */
  const deleteBlogHandler = async () => {
    if (!blog?._id) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/blog/delete/${blog._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update Redux store
        const updatedBlogs = blogs.filter((blogItem) => blogItem?._id !== blog?._id);
        dispatch(setBlogs(updatedBlogs));

        // Show success toast
        setToastMessage({ message: res.data.message || "Blog Deleted Successfully", type: "success" });

        // Close modal AFTER toast disappears
        setTimeout(() => setToastMessage(null), 2000);
        setTimeout(() => setOpen(false), 2500);
      }
    } catch (error) {
      setToastMessage({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <button
        onClick={() => setOpen(true)}
        className="font-bold text-lg hover:text-gray-500 cursor-pointer"
      >
        <div className="mr-2 text-xl">...</div>
      </button>

      {/* Dialog Box Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          {toastMessage && (
            <div className={`toast ${toastMessage.type}`}>
              {toastMessage.message}
            </div>
          )}

          {/* Dialog Content */}
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-80">
            {/* Follow/Unfollow Button (only show if the author is not the logged-in user) */}
            {user && author && user._id !== author._id && (
              <button
                onClick={handleFollowToggle}
                className={`w-full py-2 rounded-t-lg border-b border-gray-300 hover:cursor-pointer ${
                  following
                    ? "bg-white text-red-500 hover:bg-gray-300"
                    : "text-blue-600 bg-white hover:bg-gray-300"
                }`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            )}

            {/* Delete Button (only show if logged-in user is the author) */}
            {user && author && user._id === author._id && (
              <button
                onClick={deleteBlogHandler}
                className="w-full text-red-600 py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
              >
                Delete
              </button>
            )}

            {/* Add to Favourites Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
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

export default BlogDialog;