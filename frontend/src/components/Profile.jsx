import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { MdSettings } from "react-icons/md";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = true;
  const isFollowing = true;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar size={"xl"} image={userProfile?.profilePicture} />
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <button className="hover:bg-gray-300 hover:cursor-pointer h-8 rounded-md bg-gray-200  px-4">
                      Edit profile
                    </button>
                    <button className="hover:bg-gray-300 hover:cursor-pointer h-8 rounded-md bg-gray-200 px-4">
                      view archive
                    </button>
                    <MdSettings
                      size={28}
                      className="hover:cursor-pointer text-gray-800"
                    />
                  </>
                ) : isFollowing ? (<>
                  <button className="bg-gray-200  hover:bg-gray-300 text-red-500 py-2 px-4 rounded-md text-sm">
                    Unfollow
                  </button>
                  <button className="hover:bg-gray-300 hover:cursor-pointer h-8 rounded-md bg-gray-200 px-4">
                      message
                    </button>
                </>
                  
                ) : (
                  <button className="bg-[#179cf5] hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md text-sm">
                    Follow
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
