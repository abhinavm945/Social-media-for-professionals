import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import Toast from "./Toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // ✅ Initialize as null

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.user) {
        dispatch(setAuthUser(res.data.user));
        setToast({ message: res.data.message, type: "success" });

        // ✅ Delay navigation so user sees the toast
        setTimeout(() => {
          navigate("/");
        }, 2000);

        setInput({ email: "", password: "" });
      } else {
        setToast({
          message: "Login failed: No user data received",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* ✅ Fix: Use optional chaining to prevent errors */}
      {toast?.message && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        className="bg-white p-10 rounded shadow-md w-100"
        onSubmit={loginHandler}
      >
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
            onChange={changeEventHandler}
            value={input.email}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Email/Username"
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
            onChange={changeEventHandler}
            value={input.password}
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
            "Login"
          )}
        </button>
      </form>
      <p className="mt-4">
        If you do not already have an account?{" "}
        <Link to="/signup" className="text-black hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
