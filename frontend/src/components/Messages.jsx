/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessage";
import { useRef, useState, useEffect } from "react";

const Messages = ({ selectedUser }) => {
  const { loading } = useGetAllMessage();
  const { messages, isTyping } = useSelector((store) => store.chat);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - (scrollTop + clientHeight) > 100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col h-full p-4 overflow-y-auto custom-scrollbar relative">
      <div className="flex flex-col items-center justify-center mb-4 top-0 z-10 p-4 w-full">
        <Avatar size="lg" image={selectedUser?.profilePicture} />
        <span className="font-medium text-center">
          {selectedUser?.username}
        </span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <button className="text-black cursor-pointer bg-gray-200 py-2 px-3 rounded-md my-2">
            View Profile
          </button>
        </Link>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Messages */}
      {!loading && (
        <div
          className="flex flex-col gap-3 flex-1 custom-scrollbar p-2 relative "
          onScroll={handleScroll}
        >
          {messages && messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === selectedUser?._id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-lg shadow-md text-sm relative ${
                      msg.senderId === selectedUser?._id
                        ? "bg-gray-300 text-black "
                        : "bg-blue-500 text-white pr-5"
                    }`}
                  >
                    {msg.message}
                    <div className="text-xs mt-1 text-right font-light">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                    {msg.senderId !== selectedUser._id && (
                      <div className="absolute top-1 right-1">
                        <button className="text-white hover:text-gray-700 pr-1 font-bold hover:cursor-pointer">
                          ⋮
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-2 bg-gray-200 rounded-lg text-sm">
                    Typing...
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-lg">
              <span className="text-6xl mb-4">💬</span>
              <p>{`Your chat with ${selectedUser?.username} is empty. Say hello!`}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Scroll-to-bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-10 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          ↓
        </button>
      )}
    </div>
  );
};

export default Messages;
