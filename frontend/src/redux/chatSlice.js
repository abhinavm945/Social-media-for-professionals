import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    onlineUsers: [],
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUser: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setSelectedUser, setOnlineUser } = chatSlice.actions;
export default chatSlice.reducer;
