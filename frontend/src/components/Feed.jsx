import { useState } from "react";
import Blogs from "./Blogs";
import Posts from "./Posts";

function Feed() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("blogs");

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="">
        <div className="flex items-center justify-center gap-24 text-sm">
          {["blogs", "posts"].map((tab) => (
            <span
              key={tab}
              className={`py-3 cursor-pointer ${
                activeTab === tab
                  ? "font-bold border-b-2 border-gray-400"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.toUpperCase().replace("-", " ")}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
        {/* Conditionally render Posts or Blogs based on activeTab */}
        {activeTab === "posts" ? <Posts /> : <Blogs />}
      </div>
    </>
  );
}

export default Feed;
