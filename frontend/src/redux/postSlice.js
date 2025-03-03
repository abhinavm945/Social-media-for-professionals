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
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
  },
});

export const { setPosts, setBlogs } = postSlice.actions;
export default postSlice.reducer;
