import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || "",
    gender: user?.gender || "male",
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setInput({ ...input, profilePhoto: imageUrl, selectedFile: file });
    }
  };

  const selectChangeHandler = (e) => {
    setInput({ ...input, gender: e.target.value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.selectedFile) {
      formData.append("profilePhoto", input.selectedFile);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(
          setAuthUser({
            ...user,
            bio: res.data.user?.bio,
            profilePicture: res.data.user?.profilePicture,
            gender: res.data.user?.gender,
          })
        );
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        {/* Profile Picture */}
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar
              size={"lg"}
              image={input.profilePhoto || user?.profilePicture}
            />
            <div className="items-center">
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">{input.bio || "No Bio..."}</span>
            </div>
          </div>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={fileChangeHandler}
          />
          <button
            onClick={() => imageRef.current.click()}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-md py-2 px-4"
          >
            Change Photo
          </button>
        </div>

        {/* Bio Input */}
        <div>
          <h1 className="font-semibold text-xl mb-2">Bio</h1>
          <input
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            type="text"
            className="border border-gray-200 rounded-md h-20 w-full p-2"
          />
        </div>

        {/* Gender Selection */}
        <div>
          <h1 className="font-semibold mb-2">Gender</h1>
          <select
            value={input.gender}
            onChange={selectChangeHandler}
            className="w-full border border-gray-200 rounded-md py-2 px-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={editProfileHandler}
            className="bg-blue-500 hover:bg-blue-700 rounded-md py-2 px-4 text-white h-10 flex items-center justify-center disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
