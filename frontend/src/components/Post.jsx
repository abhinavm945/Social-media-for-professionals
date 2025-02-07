/* eslint-disable react/prop-types */
import { Bookmark, MessageCircle, Send } from "lucide-react";
import Avatar from "./Avatar";
import PostDialog from "./PostDialog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice.js";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  // ✅ Fix: Ensure we extract the first author properly
  const author =
    Array.isArray(post.author) && post.author.length > 0
      ? post.author[0]
      : null;

  const LikeOrDisLikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(!liked);
        setPostLike((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));

        // ✅ Correctly updating the post state in Redux
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p, // Keep all other properties of the post
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {author && (
            <>
              <Avatar size={"xs"} image={author.profilePicture} />
              <h1 className=" font-medium">{author.username}</h1>
            </>
          )}
        </div>
        <PostDialog
          username={author ? author.username : "Unknown"}
          isFollowing={true}
          post={post}
          onFollowToggle={(status) => console.log(status)}
        />
      </div>

      {/* Post Image */}
      <img
        className="rounded-sm my-2 aspect-square object-cover"
        src={post.image}
        alt="Post-picture"
      />

      {/* Post Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* ✅ Fixed Like Button */}
          {liked ? (
            <FaHeart
              size={"23px"}
              className="cursor-pointer text-red-600 hover:text-gray-600"
              onClick={LikeOrDisLikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"23px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={LikeOrDisLikeHandler}
            />
          )}

          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      {/* Likes Count */}
      <span className="font-medium block my-2">{postLike} likes</span>

      {/* Post Caption */}
      <p>
        <span className="font-medium mr-2">
          {author ? author.username : "Unknown"}
        </span>
        {post.caption}
      </p>

      {/* Comments Section */}
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-600"
      >
        View all {post.comments?.length || 0} comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} post={post} />

      {/* Add Comment */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3badf8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
