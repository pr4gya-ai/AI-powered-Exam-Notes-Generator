import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from '../redux/userSlice'
import { serverURL } from '../services/api';

const Navbar = () => {

  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits || 0

  const [showCredits, setShowCredits] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    try {
      await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true
      });

      dispatch(setUser(null))
      setShowProfile(false)
      navigate("/auth", { replace: true })

    } catch (error) {
      console.log(error)
    }
  };

  return (

    <motion.div
      className='relative z-20 mx-6 mt-6 rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_22px_55px_rgba(0,0,0,0.75)] flex items-center justify-between px-8 py-4'
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
    >

      {/* Left side */}
      <div className='flex items-center gap-3'>
        
        {/* ✅ FIXED LOGO PATH */}
        <img src="/assets/logo.jpg" alt="Logo" className='w-12 h-12 aspect-square object-cover rounded-none border border-white/20' />

        <span className='text-lg font-semibold text-white'>
          PrepMind <span className='text-gray-400'>AI</span>
        </span>
      </div>


      {/* Right side */}
      <div className='flex items-center gap-6 relative'>

        {/* Credits */}
        <div className='relative'>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowCredits(!showCredits)
              setShowProfile(false)
            }}
            className='flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white text-sm shadow-md cursor-pointer'
          >

            <span className='text-xl'>💎</span>
            <span className='text-white'>{credits}</span>

            <motion.span
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className='ml-2 h-5 w-5'
            >
              ➕
            </motion.span>

          </motion.div>


          <AnimatePresence>

            {showCredits && (

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className='absolute right-0 top-full mt-6 w-60 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-6 text-white'
              >

                <h4 className='font-semibold mb-2'>Buy Credits</h4>

                <p className='text-sm text-gray-300 mb-4'>
                  Use credits to generate AI notes, diagrams & PDFs.
                </p>

                <button
                  onClick={() => { setShowCredits(false); navigate("/price") }}
                  className='w-full py-2 rounded-lg bg-gradient-to-br from-white to-gray-200 text-black font-semibold hover:opacity-90'
                >
                  Buy More Credits
                </button>

              </motion.div>

            )}

          </AnimatePresence>

        </div>


        {/* Profile */}
        <div className='relative'>

          <motion.div
            onClick={() => {
              setShowProfile(!showProfile)
              setShowCredits(false)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.97 }}
            className='flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white text-sm shadow-md cursor-pointer'
          >

            <span className='text-xl text-white'>
              {userData?.name?.[0]?.toUpperCase() || "U"}
            </span>

          </motion.div>


          <AnimatePresence>

            {showProfile && (

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className='absolute right-0 top-full mt-6 w-[180px] rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-2 text-white'
              >

                <MenuItem text="History" onClick={() => { setShowProfile(false); navigate("/history") }} />

                <div className="h-px bg-white/10 mx-3" />

                <MenuItem text="Sign out" red onClick={handleSignOut} />

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </motion.div>
  )
}


function MenuItem({ onClick, text, red }) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer
        ${red
          ? "text-red-400 hover:bg-red-500/10"
          : "text-gray-200 hover:bg-white/10"
        }`}
    >
      {text}
    </div>
  )
}

export default Navbar