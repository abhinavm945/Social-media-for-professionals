/* eslint-disable react/prop-types */
import { useState } from "react";

function PostDialog({
  username = "User",
  isFollowing = false,
  onFollowToggle,
}) {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = () => {
    setFollowing(!following);
    if (onFollowToggle) {
      onFollowToggle(!following);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <button
        onClick={() => setOpen(true)}
        className=" font-bold text-lg hover:text-gray-500 cursor-pointer "
      >
        <div className="mb-2">...</div>
      </button>

      {/* Dialog Box Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50  z-50">
          {/* Dialog Content */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {username}
            </h2>

            <button
              onClick={handleFollowToggle}
              className={`w-full py-2 text-white rounded-md ${
                following
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {following ? "Unfollow" : "Follow"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
            >
              Add to favourites
            </button>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
            >
              Delete
            </button>


            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
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
