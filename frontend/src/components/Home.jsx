import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import useGetAllPosts from "../hooks/useGetAllPosts";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";

function Home() {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <div className="hidden lg:block w-72 ml-auto mr-5">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home;
