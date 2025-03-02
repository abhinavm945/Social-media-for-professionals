import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    blogs:[],
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setblogs: (state, action) => {
      state.blogs = action.payload;
    },
  },
});

export const { setPosts, setblogs } = postSlice.actions;
export default postSlice.reducer;
