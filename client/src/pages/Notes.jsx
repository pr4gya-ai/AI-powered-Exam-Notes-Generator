import React from 'react'
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TopicForm from '../components/TopicForm'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'

function Notes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits || 0

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState("")

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-8'>

      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-10 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex md:items-center justify-between gap-4 flex-col md:flex-row'
      >

        <div onClick={() => navigate("/")} className='cursor-pointer'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent'>
            PrepMind AI
          </h1>
          <p className='text-sm text-gray-300 mt-2'>
            AI-Powered Exam-Focused Notes & Instant Revision
          </p>
        </div>

        <div className='flex items-center gap-4 flex-wrap'>

          <button
            onClick={() => navigate("/price")}
            className='flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border-white/20 text-white text-sm'
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
          </button>

          <button
            onClick={() => navigate("/history")}
            className='px-4 py-3 rounded-full text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center gap-3'
          >
            📖 Your Notes
          </button>

        </div>

      </motion.header>

      {/* Topic Form */}
      <motion.div className='mb-12'>
        <TopicForm
          loading={loading}
          setResult={setResult}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />
      </motion.div>

      {/* Loading Modal */}
      {loading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6'>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className='w-full max-w-md rounded-2xl bg-white/90 p-6 text-center shadow-lg'
          >
            <div className='text-lg font-bold text-black mb-2'>
              Generating notes...
            </div>
            <div className='text-sm text-gray-700'>
              Please wait while we generate your AI notes.
            </div>
          </motion.div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className='text-center text-red-600 font-medium mb-6'>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!result && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='h-24 rounded-2xl flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg border border-dashed border-gray-300 text-gray-500 shadow-inner'
        >
          <span className='text-4xl mb-3'>📝</span>
          <p className='text-sm'>Generated notes will appear here</p>
        </motion.div>
      )}

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='grid grid-cols-1 lg:grid-cols-4 gap-6'
        >

          <div className='lg:col-span-1'>
            <Sidebar result={result} />
          </div>

          <div className='lg:col-span-3 rounded-2xl bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] p-6 min-h-[500px]'>
            <FinalResult result={result} />
          </div>

        </motion.div>
      )}

    </div>
  )
}

export default Notes