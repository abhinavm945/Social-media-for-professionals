import { useSelector } from "react-redux";
import { useState } from "react";
import RightSidebar from "./RightSidebar";
import CommentDialog from "./CommentDialog";
import BlogCommentDialog from "./BlogCommentDialog";
import Avatar from "./Avatar";

function Trending() {
  const [activeTab, setActiveTab] = useState("posts");
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { posts, blogs } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  // Sort posts and blogs by engagement (likes + comments)
  const sortedPosts = [...posts].sort(
    (a, b) =>
      b.likes.length + b.comments.length - (a.likes.length + a.comments.length)
  );

  const sortedBlogs = [...blogs].sort(
    (a, b) =>
      b.likes.length + b.comments.length - (a.likes.length + a.comments.length)
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenPostDialog = (post) => {
    if (post) {
      setSelectedPost(post); // Set selected post
      setSelectedBlog(null); // Reset selected blog
      setOpen(true); // Open the dialog
    }
  };

  const handleOpenBlogDialog = (blog) => {
    if (blog) {
      setSelectedBlog(blog); // Set selected blog
      setSelectedPost(null); // Reset selected post
      setOpen(true); // Open the dialog
    }
  };

  return (
    <div className="flex max-w-7xl justify-center mr-5 mx-auto pl-10">
      <div className="flex flex-col gap-10 p-6 w-full lg:w-3/4">
        {/* Section Heading */}
        <h2 className="text-2xl font-bold text-gray-800">🔥 Trending Now</h2>

        <div className="border-t border-t-gray-300 pt-4">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-12 text-sm">
            {["posts", "blogs"].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer ${
                  activeTab === tab
                    ? "font-bold border-b-2 border-gray-400"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Display Trending Posts */}
          {activeTab === "posts" ? (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-700 py-3">
                Trending Posts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {sortedPosts.length > 0 ? (
                  sortedPosts.map(
                    (post) =>
                      post &&
                      user?._id !== post?.author?._id && (
                        <div key={post?._id} className="flex flex-col gap-2">
                          <div className="absolute z-10 px-4 flex items-center gap-2 bg-white py-1 rounded-lg shadow-lg m-3">
                            <Avatar
                              size="xs"
                              image={post?.author?.profilePicture}
                            />
                            <span className="text-sm font-medium text-black">
                              {post?.author?.username}
                            </span>
                          </div>
                          <div
                            onClick={() => handleOpenPostDialog(post)}
                            className="relative group cursor-pointer"
                          >
                            <img
                              src={post?.image}
                              alt="postimage"
                              className="rounded-md w-full aspect-square object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex items-center text-white space-x-4">
                                <span>{post?.likes.length} Likes</span>
                                <span>{post?.comments.length} Comments</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <p className="text-center text-gray-500 col-span-3">
                    No trending posts available.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-700 py-3">
                Trending Blogs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBlogs.length > 0 ? (
                  sortedBlogs.map(
                    (blog) =>
                      blog &&
                      user?._id !== blog?.author?._id && (
                        <div
                          key={blog._id}
                          onClick={() => handleOpenBlogDialog(blog)}
                          className="relative bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="absolute z-10 px-4 flex items-center gap-2 bg-white py-1 rounded-lg shadow-lg m-3">
                            <Avatar
                              size="xs"
                              image={blog?.author?.profilePicture}
                            />
                            <span className="text-sm font-medium text-black">
                              {blog?.author?.username}
                            </span>
                          </div>
                          <div className="relative">
                            {blog?.image || blog?.gifUrl ? (
                              <img
                                src={blog?.image || blog?.gifUrl}
                                alt="Blog"
                                className="w-full h-40 object-cover"
                              />
                            ) : (
                              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 italic">
                                No image uploaded for this content
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900">
                              {blog?.blogTitle}
                            </h3>
                            <p
                              className="text-gray-600 text-sm line-clamp-2 mt-2"
                              dangerouslySetInnerHTML={{
                                __html: blog?.blogDiscription,
                              }}
                            ></p>
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <p className="text-center text-gray-500">
                    No trending blogs available.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-72 ml-auto">
        <RightSidebar />
      </div>

      {/* Comment Dialog for Posts */}
      {selectedPost && (
        <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
      )}

      {/* Comment Dialog for Blogs */}
      {selectedBlog && (
        <BlogCommentDialog open={open} setOpen={setOpen} blog={selectedBlog} />
      )}
    </div>
  );
}

export default Trending;
