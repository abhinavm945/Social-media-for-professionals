import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-72 my-10 pr-8">
      {/* User Profile Section */}
      {user && (
        <div className="flex justify-between items-center mb-6">
          <Link
            to={`/profile/${user?._id}`}
            className="flex items-center gap-3"
          >
            <Avatar size="sm" image={user?.profilePicture} />
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-500 text-xs">
                {user?.bio || "No bio available"}
              </span>
            </div>
          </Link>
          <Link to="/login" className="text-blue-500 text-sm font-semibold">
            Switch
          </Link>
        </div>
      )}

      {/* Suggested Users Section */}
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
