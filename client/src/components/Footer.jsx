import React from "react";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serverURL } from "../services/api";

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUser(null));
      navigate("/auth", { replace: true });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="z-10 mt-6 mb-6 rounded-2xl 
      bg-gradient-to-br from-black/90 via-black/80 to-black/90 
      border border-white/10 px-8 py-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* LEFT */}
        <motion.div
          whileHover={{ rotateX: 6, rotateY: -6 }}
          className="flex flex-col gap-4 transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="flex items-center gap-3 cursor-pointer"
            style={{ transform: "translateZ(20px)" }}
          >
           
            <img src="/assets/logo.jpg" alt="logo" className="h-9 w-9 object-contain" />

            <span
              className="text-lg font-semibold bg-gradient-to-br from-white via-gray-300 to-white bg-clip-text text-transparent"
              style={{ textShadow: "0 6px 18px rgba(0,0,0,0.4)" }}
            >
              ExamNotes <span className="text-gray-400">AI</span>
            </span>
          </div>

          <p className="text-sm text-gray-300 max-w-sm">
            ExamNotes AI helps students generate exam-focused notes, revision
            material, diagrams, and printable PDFs using AI.
          </p>
        </motion.div>

        {/* CENTER */}
        <div className="text-center">
          <h1 className="text-sm font-semibold text-white mb-4">Quick Links</h1>
          <ul className="space-y-2 text-sm">
            <li onClick={() => navigate("/notes")} className="text-gray-300 hover:text-white cursor-pointer">
              Notes
            </li>
            <li onClick={() => navigate("/history")} className="text-gray-300 hover:text-white cursor-pointer">
              History
            </li>
            <li onClick={() => navigate("/price")} className="text-gray-300 hover:text-white cursor-pointer">
              Add Credits
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="text-center">
          <h1 className="text-sm font-semibold text-white mb-4">Support & Account</h1>
          <ul className="space-y-2 text-sm">
            <li onClick={() => navigate("/auth")} className="text-gray-300 hover:text-white cursor-pointer">
              Sign In
            </li>
            <li onClick={handleSignOut} className="text-red-400 hover:text-red-300 cursor-pointer">
              Sign Out
            </li>
            <li className="text-gray-300">
              support@examnotes.com
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ExamNotes AI. All rights reserved.
        </p>
      </div>
    </motion.div>
  );
};

export default Footer;