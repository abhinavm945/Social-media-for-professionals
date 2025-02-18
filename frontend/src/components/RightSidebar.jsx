import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-fit my-10 pr-28">
      <div className="flex items-center gap-2">
        {user && (
          <>
            <Link to={`/profile/${user?._id}`}>
              <Avatar size={"xs"} image={user?.profilePicture} />
            </Link>
            <div className="items-center">
              <Link to={`/profile/${user?._id}`}>
                <h1 className="font-medium">{user?.username}</h1>
              </Link>
              <span className="text-gray-600 text-sm">
                {user?.bio || "No Bio..."}
              </span>
            </div>
          </>
        )}
        <Link to="/login" className="text-blue-500 items-center gap-4 px-5">
          Switch
        </Link>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
