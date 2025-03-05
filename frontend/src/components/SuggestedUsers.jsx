import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import axios from "axios";
import { toast } from "react-toastify";
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "../redux/authSlice";

const SuggestedUsers = () => {
  const { suggestedUsers, user, userProfile } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();

  const handleFollowOrUnfollow = async (suggestedUser) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${suggestedUser?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const isFollowing = suggestedUser?.followers.includes(user._id);

        // Update the logged-in user's following list in userProfile
        if (user._id === userProfile._id) {
          const updatedUserProfile = {
            ...userProfile,
            following: isFollowing
              ? userProfile.following.filter((id) => id !== suggestedUser._id) // Remove from following
              : [...userProfile.following, suggestedUser._id], // Add to following
          };
          dispatch(setUserProfile(updatedUserProfile));
        }

        // Update the suggested user's followers list in suggestedUsers
        const updatedSuggestedUsers = suggestedUsers.map(
          (userItem) =>
            userItem._id === suggestedUser._id
              ? {
                  ...userItem,
                  followers: isFollowing
                    ? userItem.followers.filter((id) => id !== user._id) // Remove from followers
                    : [...userItem.followers, user._id], // Add to followers
                }
              : userItem // Keep other suggested users unchanged
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers));

        const updatedAuthUser = {
          ...user,
          following: isFollowing
            ? user.following.filter((id) => id !== suggestedUser._id) // Remove from following
            : [...user.following, suggestedUser._id], // Add to following
        };

        dispatch(setAuthUser(updatedAuthUser));

        // Also update `userProfile` followers list **if we are on their profile page**
        if (userProfile._id === suggestedUser._id) {
          const updatedProfile = {
            ...userProfile,
            followers: isFollowing
              ? userProfile.followers.filter((id) => id !== user._id) // Remove from followers
              : [...userProfile.followers, user._id], // Add to followers
          };
          dispatch(setUserProfile(updatedProfile));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggestions for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers
          .filter((suggestedUser) => suggestedUser._id !== user?._id) // Filter out the logged-in user
          .map((suggestedUser) => {
            const isFollowing = suggestedUser?.followers.includes(user._id); // Check if the user is following

            return (
              <div
                key={suggestedUser._id}
                className="flex justify-between items-center my-2"
              >
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
                <button
                  onClick={() => handleFollowOrUnfollow(suggestedUser)}
                  className={`text-sm font-bold cursor-pointer ${
                    isFollowing
                      ? "text-gray-500 hover:text-red-500"
                      : "text-[#3badf8]"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            );
          })
      ) : (
        <p className="text-gray-500">No suggestions available.</p>
      )}
    </div>
  );
};

export default SuggestedUsers;
