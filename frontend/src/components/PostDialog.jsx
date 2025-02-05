/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

function PostDialog({
  isFollowing = false,
  onFollowToggle,
}) {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const dialogRef = useRef(null);

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
          {/* Dialog Content */}
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-80 ">
            <button
              onClick={handleFollowToggle}
              className={`w-full py-2 rounded-t-lg border-b border-gray-300 ${
                following
                  ? "bg-white text-red-500 hover:bg-gray-300"
                  : " text-blue-600 bg-white hover:bg-gray-300"
              }`}
            >
              {following ? "Unfollow" : "Follow"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className=" w-full py-2 bg-white hover:bg-gray-300 border-b border-gray-300"
            >
              Add to favourites
            </button>

            <button
              onClick={() => setOpen(false)}
              className=" w-full py-2 bg-white hover:bg-gray-300 border-b border-gray-300"
            >
              Delete
            </button>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 bg-white hover:bg-gray-300 rounded-b-lg border-b border-gray-300"
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
