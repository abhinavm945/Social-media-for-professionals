import { useState } from "react";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePostDialog from "./CreatePostDialog";
import CreateBlogDialog from "./CreateBlogDialog";
import Toast from "./Toast";
import {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
} from "../redux/authSlice";
import { setPosts } from "../redux/postSlice";
import Avatar from "./Avatar";
import { setMessages, setSelectedUser } from "../redux/chatSlice";

function LeftSidebar() {
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [createBlog, setCreateBlog] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        setToast({ message: res.data.message, type: "success" });
        setTimeout(
          () => [
            dispatch(setAuthUser(null)),
            dispatch(setUserProfile(null)),
            dispatch(setSelectedUser(null)),
            dispatch(setSuggestedUsers([])),
            dispatch(setMessages([])),
            dispatch(setPosts([])),
            navigate("/login"),
          ],
          1000
        );
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Something went wrong",
        type: "error",
      });
    }
  };

  const sidebarHandler = (item) => {
    if (item.text === "Logout") {
      logoutHandler();
    } else if (item.text === "Create") {
      setOpenCreate(!openCreate); // Toggle the dropdown
    } else {
      navigate(item.path);
    }
  };

  const sidebarItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Search", icon: <Search />, path: "/search" },
    { text: "Trending", icon: <TrendingUp />, path: "/trending" },
    { text: "Messages", icon: <MessageCircle />, path: "/chat" },
    { text: "Notifications", icon: <Heart />, path: "/notifications" },
    { text: "Create", icon: <PlusSquare /> },
    {
      text: "Profile",
      icon: user?.profilePicture ? (
        <Avatar size="xs" image={user.profilePicture} />
      ) : (
        <IoPersonOutline size={24} />
      ),
      path: `/profile/${user?._id}`,
    },
    { text: "Logout", icon: <LogOut /> },
  ];

  return (
    <>
      {toast.message && <Toast message={toast.message} type={toast.type} />}
      <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
        <div className="flex flex-col">
          <h1 className="font-bold my-5 pl-3 text-3xl">SOCIAL MEDIA</h1>
          <div>
            {sidebarItems.map((item, index) => (
              <div key={index}>
                <div
                  onClick={() => sidebarHandler(item)}
                  className="relative flex items-center gap-4 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                >
                  {item.icon}
                  <span>{item.text}</span>

                  {item.text === "Notifications" &&
                    likeNotification.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute left-5 top-1">
                        {likeNotification.length}
                      </span>
                    )}
                </div>

                {/* Dropdown for Create */}
                {item.text === "Create" && openCreate && (
                  <div >
                    <button
                      onClick={() => {
                        setOpen(true);
                        setOpenCreate(false); // Close the dropdown after clicking
                      }}
                      className="w-full text-center p-3 hover:bg-gray-100"
                    >
                      Create Post
                    </button>
                    <hr className="border-gray-300" />
                    <button
                      onClick={() => {
                        setCreateBlog(true);
                        setOpenCreate(false); // Close the dropdown after clicking
                      }}
                      className="w-full text-center p-3 hover:bg-gray-100 "
                    >
                      Create Blog
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <CreatePostDialog open={open} setOpen={setOpen} />
        <CreateBlogDialog createBlog={createBlog} setCreateBlog={setCreateBlog} />
      </div>
    </>
  );
}

export default LeftSidebar;