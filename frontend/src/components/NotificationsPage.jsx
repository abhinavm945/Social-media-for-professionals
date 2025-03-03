import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { ArrowLeft } from "lucide-react";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg h-[90%]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <ArrowLeft
          size={28}
          className="cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {/* No Notifications */}
      {likeNotification.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No new notifications.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {likeNotification.map((notification) => (
            <div
              key={notification.userId}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                navigate(`/profile/${notification.userDetails?._id}`)
              }
            >
              <Avatar
                size="md"
                image={notification.userDetails?.profilePicture}
              />
              <div>
                <p className="text-gray-800">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
