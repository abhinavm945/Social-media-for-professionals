import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setblogs, setPosts } from "../redux/postSlice";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, [dispatch]);
  useEffect(() => {
    const fetchAllblogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/blog/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setblogs(res.data.blogs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllblogs();
  }, [dispatch]);
};

export default useGetAllPosts;
