import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, suggestedUsers: [], userProfile: null },
  // ✅ Ensure initialState is an object
  reducers: {
    setAuthUser: (state, action) => {
      return { ...state, user: action.payload }; // ✅ Ensure state is always an object
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
