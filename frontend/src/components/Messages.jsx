/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const Messages = ({ selectedUser }) => {
  return (
    <div className="bg-gray-50 flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-center justify-center mb-4  top-0 z-10 p-4 w-full">
        <Avatar size="lg" image={selectedUser?.profilePicture} />
        <span className="font-medium text-center">
          {selectedUser?.username}
        </span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <button className="text-black cursor-pointer bg-gray-200 py-2 px-3 rounded-md my-2">
            View Profile
          </button>
        </Link>
      </div>
      <div className="flex flex-col gap-3 flex-1 custom-scrollbar p-2">
        {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map(
          (msg, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-xs rounded-lg shadow-md text-white text-sm ${
                  index % 2 === 0 ? "bg-blue-500" : "bg-gray-300 text-black"
                }`}
              >
                {msg}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Messages;
