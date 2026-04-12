import axios from "axios";
import { setUser } from "../redux/userSlice";

export const serverURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: serverURL,
  withCredentials: true,
});

// GET CURRENT USER
export const getCurrentUser = async (dispatch) => {
  try {
    const res = await API.get("/api/user/currentuser");

    const user = res.data.user;

    dispatch(setUser(user));

    return user;
  } catch (err) {
    const status = err.response?.status;
    if (status === 401 || status === 400) {
      // Not authenticated / session expired; no noisy error log
      dispatch(setUser(null));
      return null;
    }

    console.error("Error fetching user:", err);
    dispatch(setUser(null));
    return null;
  }
};

// GOOGLE AUTH
export const googleAuth = async (data) => {
  try {
    const res = await API.post("/api/auth/google", data);
    return res.data.user || null;
  } catch (err) {
    console.error("Google auth error:", err);
    throw err;
  }
};

// GENERATE NOTES
export const generateNotes = async (payload) => {
  try {
    const res = await API.post("/api/generate/generate-notes", payload);

    console.log("Notes generated successfully:", res.data);

    return res.data;

  } catch (err) {

    console.error("Error generating notes:", err.response?.data || err.message);

    // Send readable error to frontend
    throw new Error(err.response?.data?.message || "Failed to generate notes");
  }
};

export const downloadPdf = async (result) => {
    try {
        const response = await API.post("/api/pdf/generate-pdf", { result }, {
            responseType: "blob"
        });

        const blob = new Blob([response.data], {
            type: "application/pdf"
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExamNotesAI.pdf";
        link.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error("PDF download failed");
    }
}

// LOGOUT
export const logout = async (dispatch) => {
  try {
    const res = await API.get("/api/auth/logout");

    // clear redux user
    dispatch(setUser(null));

    return res.data;

  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
};