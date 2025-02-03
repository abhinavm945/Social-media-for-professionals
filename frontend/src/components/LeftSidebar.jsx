import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PersonStanding,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  {
    icon: <Home />,
    text: "Home",
  },
  {
    icon: <Search />,
    text: "Search",
  },
  {
    icon: <TrendingUp />,
    text: "Explore",
  },
  {
    icon: <MessageCircle />,
    text: "Messages",
  },
  {
    icon: <Heart />,
    text: "Notifications",
  },
  {
    icon: <PlusSquare />,
    text: "Create",
  },
  {
    icon: <PersonStanding />,
    text: "Profile",
  },
  {
    icon: <LogOut />,
    text: "Logout",
  },
];

function LeftSidebar() {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.res.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType == "Logout") {
      logoutHandler();
    }
  };
  return (
    <div className="fixeed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className=" text-3xl my-5">SOCIAL MEDIA</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
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
