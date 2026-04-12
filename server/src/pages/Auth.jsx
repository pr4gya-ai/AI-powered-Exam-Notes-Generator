import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from '../utils/firebase';
import { signInWithPopup } from "firebase/auth";
import { serverURL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../redux/userSlice";
import Footer from '../components/Footer';

const Auth = () => {

  const [error, setError] = useState(null);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user.userData)

  // Redirect when Redux user exists
  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleGoogleAuth = async () => {
    try {

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const response = await axios.post(
        serverURL + "/api/auth/google",
        {
          name: firebaseUser.displayName,
          email: firebaseUser.email
        },
        { withCredentials: true }
      );

      dispatch(setUser(response.data.user));   // Redux update
      setUser(firebaseUser);                   // Local UI update
      navigate("/", { replace: true });  

    } catch (err) {
      console.log(err);
      setError("Google sign-in failed");
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-white text-black px-8'>

      {error && (
        <div className="max-w-7xl mx-auto mt-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <motion.header
        initial={{opacity: 0, y: -15}}
        animate={{opacity: 1, y: 0}}
        transition={{duration:1.5}}
        className='max-w-7xl mx-auto mt-8 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)]'
      >

        <h1 className='text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent'>
          PrepMind AI
        </h1>

        <p className='text-sm text-gray-300 mt-2'>
          AI-Powered Exam-Focused Notes & Instant Revision
        </p>

      </motion.header>

      <main className='flex-grow max-w-7xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>

        <motion.div
          initial={{opacity: 0, x: -60}}
          animate={{opacity: 1, x: 0}}
          transition={{duration:0.8}}
        >

          <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-black/90 via-black/60 to-black/90 bg-clip-text text-transparent'>
            Unlock Smart <br /> AI Notes
          </h1>

          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{
              y:-10,
              rotateX:8,
              rotateY:-8,
              scale: 1.07
            }}
            whileTap={{scale:0.97}}
            transition={{type: "spring", stiffness: 200, damping: 18}}
            className='mt-10 px-10 py-3 rounded-xl flex items-center gap-3
            bg-gradient-to-br from-black/90 via-black/80 to-black/90 border-white/10 text-white font-semibold text-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
          >
            <FcGoogle size={22} />
            Continue with Google
          </motion.button>

          <p className='mt-6 max-x-xl text-la bg-gradient-to-br from-gray-700 via-gray-500/80 to-gray-700 bg-clip-text text-transparent'>
            You get <span className='font-semibold'>200 FREE Credits</span> to create exam notes, project notes, charts, graphs and download clean PDFs-instantly using AI.
          </p>

          <p className='mt-4 text-sm text-gray-500'>
            Start with 200 free credits • Upgrade anytime for more credits • Instant access
            </p>

        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <Features icon="🎁" title="200 Credits" des="Get 200 free credits to generate AI-powered exam notes instantly." />
          <Features icon="📂" title="Project Notes" des="Well-structured documentation for assignments & projects." />
          <Features icon="📊" title="Charts & Graphs" des="Auto-generated diagrams, charts and flow graphs." />
          <Features icon="⬇️" title="Free PDF Download" des="Download clean, printable PDFs instantly." />
        </div>

      </main>

      <Footer />

    </div>
  )
}

function Features({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{y:-12, rotateX:8, rotateY:-8, scale:1.05}}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className='relative rounded-2xl p-6 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] text-white'
      style={{ transformStyle: "preserve-3d" }}
    >

      <div className='relative z-10' style={{ transform: "translateZ(30px)" }}>
        <div className='text-4xl mb-3'>{icon}</div>
        <h3 className='text-lg font-semibold mb-2'>{title}</h3>
        <p className='text-gray-300 text-sm leading-relaxed'>{des}</p>
      </div>

    </motion.div>
  );
}

export default Auth;