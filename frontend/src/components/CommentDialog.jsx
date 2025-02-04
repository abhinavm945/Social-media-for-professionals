/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import Avatar from "./Avatar";

const CommentDialog = ({ open, setOpen }) => {
  const dialogRef = useRef(null);

  // Close the dialog when clicking outside the box
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

  if (!open) return null; // Prevent rendering when closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      {/* Dialog Box */}
      <div ref={dialogRef} className="bg-white p-6 rounded-lg shadow-lg w-250 ">
        <div className="flex flex-1">
          <div>
            <img
              src="https://images.unsplash.com/photo-1738430275589-2cd3d0d0d57a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMnx8fGVufDB8fHx8fA%3D%3D"
              alt="Post-picture"
            />
          </div>
          <div className=" w-1/2 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <Avatar
                size={"sm"}
                image={
                  "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                }
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Comments
              </h2>

              {/* Comment Input */}
              <textarea
                className="w-full h-24 border border-gray-300 rounded-md p-2 resize-none"
                placeholder="Write a comment..."
              ></textarea>

              {/* Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
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
