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
import CommentDialog from "./CommentDialog";
import BlogCommentDialog from "./BlogCommentDialog"; // Import the BlogCommentDialog
import Blog from "./Blog"; // Import the Blog component
import { toast } from "react-toastify"; // For showing notifications
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "../redux/authSlice";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile, user, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers.includes(user?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenDialog = (post) => {
    setSelectedPost(post); // Store the clicked post data
  };

  const handleOpenBlogDialog = (blog) => {
    setSelectedBlog(blog); // Store the clicked blog data
  };

  // Close the comment dialog
  const handleCloseDialog = () => {
    setSelectedPost(null); // Reset the selected post when closing
  };

  const handleCloseBlogDialog = () => {
    setSelectedBlog(null); // Reset the selected blog when closing
  };

  // Like or Dislike Handler
  const LikeOrDisLikeHandler = async (postId) => {
    try {
      const post = posts.find((p) => p._id === postId);
      const isLiked = post.likes.includes(user._id);
      const action = isLiked ? "dislike" : "like";

      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: isLiked
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

  // Follow or Unfollow Handler
  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const isFollowing = userProfile?.followers.includes(user._id);

        // Update only the specific user's followers list
        const updatedUserProfile = {
          ...userProfile,
          followers: isFollowing
            ? userProfile.followers.filter((id) => id !== user._id)
            : [...userProfile.followers, user._id],
        };

        // Update the user profile in Redux
        dispatch(setUserProfile(updatedUserProfile));

        // Update only the followed/unfollowed suggested user
        const updatedSuggestedUsers = suggestedUsers.map(
          (suggestedUser) =>
            suggestedUser._id === userProfile._id
              ? {
                  ...suggestedUser,
                  followers: isFollowing
                    ? suggestedUser.followers.filter((id) => id !== user._id)
                    : [...suggestedUser.followers, user._id],
                }
              : suggestedUser // Keep other users unchanged
        );

        dispatch(setSuggestedUsers(updatedSuggestedUsers));

        const updatedAuthUser = {
          ...user,
          following: isFollowing
            ? user.following.filter((id) => id !== userProfile?._id) // Remove from following
            : [...user.following, userProfile?._id], // Add to following
        };

        dispatch(setAuthUser(updatedAuthUser));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  // Combine bookmarkPosts and bookmarkBlogs for the "saved" tab
  const savedItems = [
    ...(userProfile?.bookmarkPosts || []),
    ...(userProfile?.bookmarkBlogs || []),
  ];

  // Determine displayed posts based on active tab
  const displayedPosts =
    activeTab === "posts"
      ? userProfile?.posts || []
      : activeTab === "saved"
      ? savedItems
      : [];

  // Determine displayed blogs based on active tab
  const displayedBlogs = activeTab === "blogs" ? userProfile?.blogs || [] : [];

  // Loading state
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 cursor-pointer ">
                <span className="text-2xl font-semibold ">
                  {userProfile?.username}
                </span>

                {/* Profile Action Buttons */}
                {isLoggedInUserProfile ? (
                  <div className="flex items-center gap-2 ">
                    <Link to="/account/edit">
                      <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer">
                        Edit profile
                      </button>
                    </Link>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer">
                      View Archive
                    </button>
                    <MdSettings
                      size={28}
                      className="hover:cursor-pointer text-gray-800"
                    />
                  </div>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFollowOrUnfollow}
                      className="bg-gray-200 hover:bg-gray-300 text-red-500 py-2 px-4 rounded-md text-sm cursor-pointer"
                    >
                      Unfollow
                    </button>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer">
                      Message
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleFollowOrUnfollow}
                    className="bg-[#179cf5] hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md text-sm cursor-pointer"
                  >
                    Follow
                  </button>
                )}
              </div>

              {/* Follower Stats */}
              <div className="flex justify-center md:justify-start gap-6 text-center md:text-left">
                <p>
                  <span className="font-semibold">
                    {userProfile?.blogs.length}
                  </span>{" "}
                  Blogs
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>{" "}
                  Posts
                </p>
                <p className="cursor-pointer">
                  <span className="font-semibold ">
                    {userProfile?.followers.length}
                  </span>{" "}
                  Followers
                </p>
                <p className="cursor-pointer">
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
            <div className="flex  flex-col mx-auto gap-4 max-w-lg">
              {userProfile?.blogs?.length || userProfile?.posts?.length ? (
                [...(userProfile?.posts || []), ...(userProfile?.blogs || [])]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sorting by timestamp
                  .map((item) =>
                    item?.blogTitle ? (
                      <Blog key={item._id} blog={item} />
                    ) : (
                      <Post key={item._id} post={item} />
                    )
                  )
              ) : (
                <p className="text-center text-gray-500">
                  No recent content available.
                </p>
              )}
            </div>
          ) : activeTab === "blogs" ? ( // Render blogs when "blogs" tab is active
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              {displayedBlogs?.length > 0 ? (
                displayedBlogs.map((blog) => (
                  <Blog key={blog?._id} blog={blog} />
                ))
              ) : (
                <p className="text-center text-gray-500">No blogs available.</p>
              )}
            </div>
          ) : activeTab === "posts" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {displayedPosts?.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    onClick={() => handleOpenDialog(post)}
                    key={post?._id}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post?.image}
                      alt="postimage"
                      className="rounded-md w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button
                          onClick={() => LikeOrDisLikeHandler(post?._id)}
                          className="flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                        >
                          <span>{post?.likes?.length}</span>
                          {post?.likes?.includes(user._id) ? (
                            <FaHeart size={22} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={22} />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenDialog(post)}
                          className="flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                        >
                          <span>{post?.comments?.length}</span>
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
          ) : activeTab === "saved" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {savedItems?.length > 0 ? (
                savedItems.map((item) =>
                  item?.blogTitle ? ( // Check if it's a blog
                    <div
                      key={item?._id}
                      className="relative group cursor-pointer"
                      onClick={() => handleOpenBlogDialog(item)}
                    >
                      <img
                        src={item?.image || item?.gifUrl}
                        alt="saved-item"
                        className="rounded-md w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4"></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item._id}
                      className="relative group cursor-pointer"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <img
                        src={item?.image}
                        alt="saved-item"
                        className="rounded-md w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4"></div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-gray-500 col-span-3">
                  No saved items available.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Comment Dialog for Posts */}
      {selectedPost && (
        <CommentDialog
          open={!!selectedPost} // Open only if a post is selected
          setOpen={handleCloseDialog} // Close dialog
          post={selectedPost} // Pass selected post
        />
      )}

      {/* Comment Dialog for Blogs */}
      {selectedBlog && (
        <BlogCommentDialog
          open={!!selectedBlog} // Open only if a blog is selected
          setOpen={handleCloseBlogDialog} // Close dialog
          blog={selectedBlog} // Pass selected blog
        />
      )}

      {/* Right Sidebar - Fixed at Extreme Right */}
      <div className="hidden lg:block w-72 ml-auto">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Profile;
