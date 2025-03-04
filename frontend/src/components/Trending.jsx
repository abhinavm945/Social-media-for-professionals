import { useSelector } from "react-redux";
import { useState } from "react";
import RightSidebar from "./RightSidebar";
import CommentDialog from "./CommentDialog";
import BlogCommentDialog from "./BlogCommentDialog";

function Trending() {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { posts, blogs } = useSelector((store) => store.post);

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

  const handleOpenDialog = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
  };

  const handleOpenBlogDialog = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseBlogDialog = () => {
    setSelectedBlog(null);
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
              <h3 className="text-xl font-semibold text-gray-700">Trending Posts</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {sortedPosts.length > 0 ? (
                  sortedPosts.slice(0, 5).map((post) => (
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
                        <div className="flex items-center text-white space-x-4"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-3">
                    No trending posts available.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-700">Trending Blogs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBlogs.length > 0 ? (
                  sortedBlogs.slice(0, 6).map((blog) => (
                    <div
                      key={blog._id}
                      onClick={() => setSelectedBlog(blog)}
                      className="relative bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
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
                  ))
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
      <CommentDialog
        open={!!selectedPost}
        setOpen={handleCloseDialog}
        post={selectedPost}
        comments={selectedPost?.comments || []}
      />

      {/* Comment Dialog for Blogs */}
      <BlogCommentDialog
        open={!!selectedBlog}
        setOpen={handleCloseBlogDialog}
        blog={selectedBlog}
        comments={selectedBlog?.comments || []}
      />
    </div>
  );
}

export default Trending;
