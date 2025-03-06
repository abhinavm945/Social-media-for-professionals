import { useSelector } from "react-redux";
import Post from "./Post";

function Posts() {
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  const followingUsers = user?.following || [];

  // Filter posts to only include those from users the current user is following
  const filteredPosts = posts.filter((post) =>
    followingUsers.includes(post?.author?._id)
  );

  return (
    <div>
      {filteredPosts.length > 0 ? (
        // Display posts if there are any
        filteredPosts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        // Display a message if there are no posts to show
        <div className="text-center mt-10 text-gray-500">
          <p>
            Follow users first to see their posts. / The Users you follow does
            not upload any posts.
          </p>
        </div>
      )}
    </div>
  );
}

export default Posts;
