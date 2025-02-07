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
import { setAuthUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import CreatePostDialog from "./CreatePostDialog";
import Toast from "./Toast"; // Import Toast component

const sidebarItems = [
  { icon: <Home />, text: "Home", path: "/" },
  { icon: <Search />, text: "Search", path: "/search" },
  { icon: <TrendingUp />, text: "Explore", path: "/explore" },
  { icon: <MessageCircle />, text: "Messages", path: "/messages" },
  { icon: <Heart />, text: "Notifications", path: "/notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: <IoPersonOutline size={"26px"} />,
    text: "Profile",
    path: "/profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

function LeftSidebar() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" }); // State for toast message
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        setToast({ message: res.data.message, type: "success" }); // Show success toast
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Something went wrong",
        type: "error",
      }); // Show error toast
    }
  };

  const createPostHandler = () => {
    setOpen(true);
  };

  const sidebarHandler = (item) => {
    if (item.text === "Logout") {
      logoutHandler();
    } else if (item.text === "Create") {
      createPostHandler();
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      {toast.message && <Toast message={toast.message} type={toast.type} />}
      <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col">
          <h1 className=" font-bold my-5 pl-3 text-3xl">SOCIAL MEDIA</h1>
          <div>
            {sidebarItems.map((item, index) => {
              return (
                <div
                  onClick={() => sidebarHandler(item)}
                  key={index}
                  className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounder-lg p-3 my-3"
                >
                  {item.icon}
                  <span style={{ marginLeft: 8 }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        <CreatePostDialog open={open} setOpen={setOpen} />
      </div>
    </>
  );
}

export default LeftSidebar;
