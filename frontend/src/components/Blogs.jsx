import { useSelector } from "react-redux";
import Blog from "./Blog";

function Blogs() {
  const { blogs = [] } = useSelector((store) => store.post); // Default to an empty array
  const { user } = useSelector((store) => store.auth);

  // Check if user is defined and has following
  const followingUsers = user?.following || [];

  // Filter blogs to only include those from users the current user is following
  const filteredBlogs = blogs.filter((blog) => followingUsers.includes(blog?.author?._id));

  return (
    <div>
      {filteredBlogs.length > 0 ? (
        // Display blogs if there are any
        filteredBlogs.map((blog) => <Blog key={blog._id} blog={blog} />)
      ) : (
        // Display a message if there are no blogs to show
        <div className="text-center mt-10 text-gray-500">
          <p>Follow users first to see their blogs. / The Users you follow does not upload any blogs.</p>
        </div>
      )}
    </div>
  );
}

export default Blogs;