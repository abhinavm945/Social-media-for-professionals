import { Bookmark, MessageCircle, Send } from "lucide-react";
import Avatar from "./Avatar";
import PostDialog from "./PostDialog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";

const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            size={"xs"}
            image={
              "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
            }
          >
            cn
          </Avatar>

          <h1>username</h1>
        </div>
        <PostDialog
          className=" "
          username="John Doe"
          isFollowing={true}
          onFollowToggle={(status) => console.log(status)}
        />
      </div>
      <img
        className=" rounded-sm my-2 aspect-square object-cover "
        src="https://images.unsplash.com/photo-1738430275589-2cd3d0d0d57a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMnx8fGVufDB8fHx8fA%3D%3D"
        alt="Post-picture"
      />

      <div className="flex justify-between items-center">
        <div className=" flex items-center gap-3">
          <FaRegHeart
            size={"23px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle onClick={()=>setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block my-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">Username</span>
        Caption
      </p>
      <span onClick={()=>setOpen(true)} className="cursor-pointer test-sm text-gray-600" >view all 10 comments</span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className=" flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className=" outline-none text-sm w-full"
        />
        {text && <span className="text-[#3badf8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
