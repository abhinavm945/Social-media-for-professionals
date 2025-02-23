import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { setMessages, setSelectedUser } from "../redux/chatSlice";
import { MessageCircleCode, Send } from "lucide-react";
import Messages from "./Messages";
import { useEffect, useState } from "react";
import axios from "axios";

function ChatPage() {
  const [textMessage, setTextMessage] = useState();
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser, onlineUsers, messages } = useSelector(
    (store) => store.chat
  );
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally, show a user-friendly error message
      alert("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className=" w-[82%] h-[96%] fixed ml-60 flex flex-col md:flex-row bg-gray-100 border border-gray-300 rounded-xl shadow-lg">
      {/* Left Sidebar - Conversations */}
      <section className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white h-full rounded-l-xl custom-scrollbar">
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10 flex items-center gap-3 rounded-l-xl">
          <Avatar size="md" image={user?.profilePicture} />
          <h1 className="font-bold text-lg text-gray-800">Messages</h1>
        </div>
        <div className="p-4 overflow-y-auto">
          <h2 className="font-semibold text-gray-700 mb-3 ">Suggested Users</h2>
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser._id); // Check if the user is online
              return (
                <div
                  key={suggestedUser._id} // Use _id instead of id
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <Avatar size="md" image={suggestedUser?.profilePicture} />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-800 block">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-sm ${
                        isOnline ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No suggested users available.</p>
          )}
        </div>
      </section>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col h-full bg-white rounded-xl">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-tr-xl">
              <Avatar size="md" image={selectedUser?.profilePicture} />
              <div className="ml-3">
                <span className="font-semibold text-gray-800">
                  {selectedUser?.username}
                </span>
                <span
                  className={`text-sm block ${
                    onlineUsers.includes(selectedUser._id)
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {onlineUsers.includes(selectedUser._id) // Check if selected user is online
                    ? "Active now"
                    : "Offline"}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <Messages selectedUser={selectedUser} />

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3 sticky bottom-0 rounded-xl">
              <input
                type="text"
                placeholder="Type a message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && textMessage.trim()) {
                    sendMessageHandler(selectedUser?._id);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => sendMessageHandler(selectedUser?._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-r-xl">
            <MessageCircleCode style={{ strokeWidth: '0.4' }} className="w-32 h-32 my-4 text-gray-500" />
            <span className="text-lg text-gray-500">
              Select a user to start chatting
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatPage;
