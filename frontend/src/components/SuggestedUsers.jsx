import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth); // Get logged-in user

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggestions for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers
        .filter((suggestedUser) => suggestedUser._id !== user?._id) // Exclude logged-in user
        .map((suggestedUser) => {
          return (
            <div key={suggestedUser._id} className="flex justify-between items-center my-2">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${suggestedUser._id}`}>
                  <Avatar size={"xs"} image={suggestedUser?.profilePicture} />
                </Link>
                <div className="items-center">
                  <Link to={`/profile/${suggestedUser._id}`}>
                    <h1 className="font-medium">{suggestedUser?.username}</h1>
                  </Link>
                  <span className="text-gray-600 text-sm">
                    {suggestedUser?.bio || "No Bio..."}
                  </span>
                </div>
              </div>
              <span className="text-[#3badf8] text-sm font-bold cursor-pointer hover:text-[#3495d6]">
                Follow
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default SuggestedUsers;
