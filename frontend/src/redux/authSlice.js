import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null }, // ✅ Ensure initialState is an object
  reducers: {
    setAuthUser: (state, action) => {
      return { ...state, user: action.payload }; // ✅ Ensure state is always an object
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
