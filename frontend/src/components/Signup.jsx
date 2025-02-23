import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Toast from "./Toast"; // Importing the Toast component
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // State for toast message
  const { user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setToast({ message: "Signup Successful!", type: "success" });
        setTimeout(() => {
          navigate("/login");
          setToast(null);
        }, 2000); // Redirect after showing toast
        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Something went wrong!",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {toast && <Toast message={toast.message} type={toast.type} />}{" "}
      {/* Toast */}
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form
        className="bg-white p-10 rounded shadow-md w-100"
        onSubmit={signupHandler}
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black rounded-full text-white h-10 hover:cursor-pointer flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            "Signup"
          )}
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-black hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
