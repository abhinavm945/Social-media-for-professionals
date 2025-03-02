import { useSelector } from "react-redux";
import Blog from "./Blog";

function Blogs() {
  const { blogs } = useSelector((store) => store.post);
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

export default Blogs;
