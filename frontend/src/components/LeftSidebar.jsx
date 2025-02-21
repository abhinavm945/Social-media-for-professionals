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
import Toast from "./Toast"; // Import Toast component
import { setAuthUser, setUserProfile } from "../redux/authSlice";
import { setPosts } from "../redux/postSlice";
import Avatar from "./Avatar"; // Import Avatar component

function LeftSidebar() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" }); // State for toast message
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        setToast({ message: res.data.message, type: "success" }); // Show success toast
        setTimeout(
          () => [
            dispatch(setAuthUser(null)),
            dispatch(setUserProfile(null)),
            dispatch(setPosts([])),
            navigate("/login"),
          ],
          1000
        ); // Redirect after 2s
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Something went wrong",
        type: "error",
      }); // Show error toast
    }
  };

  const sidebarHandler = (item) => {
    if (item.text === "Logout") {
      logoutHandler();
    } else if (item.text === "Create") {
      setOpen(true);
    } else {
      navigate(item.path);
    }
  };

  const sidebarItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Search", icon: <Search />, path: "/search" },
    { text: "Trending", icon: <TrendingUp />, path: "/trending" },
    { text: "Messages", icon: <MessageCircle />, path: "/messages" },
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
      <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col">
          <h1 className="font-bold my-5 pl-3 text-3xl">SOCIAL MEDIA</h1>
          <div>
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => sidebarHandler(item)}
                key={index}
                className="flex items-center gap-4 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <CreatePostDialog open={open} setOpen={setOpen} />
      </div>
    </>
  );
}

export default LeftSidebar;
