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

const sidebarItems = [
  { icon: <Home />, text: "Home", path: "/" },
  { icon: <Search />, text: "Search", path: "/search" },
  { icon: <TrendingUp />, text: "Explore", path: "/explore" },
  { icon: <MessageCircle />, text: "Messages", path: "/messages" },
  { icon: <Heart />, text: "Notifications", path: "/notifications" },
  { icon: <PlusSquare />, text: "Create", path: "/create" },
  {
    icon: <IoPersonOutline size={"26px"} />,
    text: "Profile",
    path: "/profile",
  },
  { icon: <LogOut />, text: "Logout", path: "/logout" },
];

function LeftSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const sidebarHandler = (item) => {
    if (item.text === "Logout") {
      logoutHandler();
    } else {
      navigate(item.path);
    }
  };

  return (
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
    </div>
  );
}

export default LeftSidebar;
