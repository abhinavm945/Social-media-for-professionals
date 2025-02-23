import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.chat);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) return; // Exit if no selected user

      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessage();
  }, [dispatch, selectedUser]);

  return { loading }; // Return the loading state
};

export default useGetAllMessage;