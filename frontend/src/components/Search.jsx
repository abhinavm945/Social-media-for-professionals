import { useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

function Search() {
  const { suggestedUsers } = useSelector((store) => store.auth); // Assuming users are stored in Redux
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on the search term
  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Search Users</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Suggested Users */}
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Suggested Users</h3>
        <div className="space-y-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link
                key={user._id} // Key should be on the outermost element
                to={`/profile/${user._id}`} // Corrected `to` prop
                className="flex items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <Avatar size="xs" image={user.profilePicture} />
                <span className="ml-3 font-medium">{user.username}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;