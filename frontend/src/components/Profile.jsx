/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "./Avatar";
import { MdSettings } from "react-icons/md";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import RightSidebar from "./RightSidebar";
import { setPosts } from "../redux/postSlice";
import axios from "axios";
import Post from "./Post";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [postLike, setPostLike] = useState(0);
  const [liked, setLiked] = useState(false);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers.includes(user?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Like or Dislike Handler
  const LikeOrDisLikeHandler = async (postId) => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(!liked);
        setPostLike((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));

        const updatedPosts = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Comment Handler
  const commentHandler = async (postId, text) => {
    if (!text.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const newComment = res.data.comment;
        const updatedPosts = posts.map((p) =>
          p._id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
        );

        dispatch(setPosts(updatedPosts));
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("An error occurred while posting the comment. Please try again.");
    }
  };

  // Determine displayed posts based on active tab
  const displayedPosts =
    activeTab === "posts"
      ? userProfile?.posts
      : activeTab === "saved"
      ? userProfile?.bookmarks
      : [];

  return (
    <div className="flex max-w-7xl justify-center mr-5 mx-auto pl-10">
      {/* Left Section - Profile Info and Posts */}
      <div className="flex flex-col gap-10 p-6 w-full lg:w-3/4">
        {/* User Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 ml-16">
          {/* Profile Picture */}
          <section className="flex-shrink-0">
            <Avatar size={"xl"} image={userProfile?.profilePicture} />
          </section>

          {/* Profile Details */}
          <section className="w-full text-center md:text-left">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-2xl font-semibold">
                  {userProfile?.username}
                </span>

                {/* Profile Action Buttons */}
                {isLoggedInUserProfile ? (
                  <div className="flex items-center gap-2">
                    <Link to="/account/edit">
                      <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4">
                        Edit profile
                      </button>
                    </Link>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4">
                      View Archive
                    </button>
                    <MdSettings
                      size={28}
                      className="hover:cursor-pointer text-gray-800"
                    />
                  </div>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-red-500 py-2 px-4 rounded-md text-sm">
                      Unfollow
                    </button>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4">
                      Message
                    </button>
                  </div>
                ) : (
                  <button className="bg-[#179cf5] hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md text-sm">
                    Follow
                  </button>
                )}
              </div>

              {/* Follower Stats */}
              <div className="flex justify-center md:justify-start gap-6 text-center md:text-left">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>{" "}
                  Posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}
                  </span>{" "}
                  Followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}
                  </span>{" "}
                  Following
                </p>
              </div>

              {/* Bio */}
              <div>
                <span>{userProfile?.bio || "Bio here....."}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-t-gray-300 pt-4">
          <div className="flex items-center justify-center gap-12 text-sm">
            {["recent-content", "posts", "blogs", "tags", "saved"].map(
              (tab) => (
                <span
                  key={tab}
                  className={`py-3 cursor-pointer ${
                    activeTab === tab
                      ? "font-bold border-b-2 border-gray-400"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.toUpperCase().replace("-", " ")}
                </span>
              )
            )}
          </div>

          {/* Display Posts for "Recent Content" as full posts */}
          {activeTab === "recent-content" ? (
            <div className="flex flex-col gap-4">
              {userProfile?.posts.length > 0 ? (
                userProfile.posts.map((post) => (
                  <Post key={post._id} post={post} />
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No recent content available.
                </p>
              )}
            </div>
          ) : (
            /* Grid layout for other tabs like "posts", "saved" */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {displayedPosts?.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    key={post?._id}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt="postimage"
                      className="rounded-md w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button
                          onClick={() => LikeOrDisLikeHandler(post._id)}
                          className="flex items-center gap-2 hover:text-gray-300"
                        >
                          <span>{post?.likes.length}</span>
                          {liked ? (
                            <FaHeart size={22} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={22} />
                          )}
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <span>{post?.comments.length}</span>
                          <MessageCircle />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">
                  No posts available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Fixed at Extreme Right */}
      <div className="hidden lg:block w-72 ml-auto">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Profile;
