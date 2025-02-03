import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Changed from null to false

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value }); // Fixed value update
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        alert("Login successful");
        navigate("/");
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form 
        className="bg-white p-10 rounded shadow-md w-100"
        onSubmit={loginHandler} // Fixed function name
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
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
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
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
