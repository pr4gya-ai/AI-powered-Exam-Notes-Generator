import { createSlice } from "@reduxjs/toolkit";
import { update } from "lodash";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    updateCredits: (state, action) => {
      if (state.userData) {
        state.userData.credits = action.payload;
      }
    },
  },
});

export const { setUser, updateCredits } = userSlice.actions;
export default userSlice.reducer;