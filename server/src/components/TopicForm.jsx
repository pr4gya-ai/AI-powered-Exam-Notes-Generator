import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { useDispatch } from 'react-redux'
import { generateNotes } from '../services/api.js'
import { setUser } from '../redux/userSlice.js'
import { useSelector } from 'react-redux'



const TopicForm = ({ setResult, setLoading, loading, setError }) => {

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagrams, setIncludeDiagrams] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    if (!userData) {
      setError("Please log in to generate notes.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {

      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagrams,
        includeCharts
      });

      // Result contains { data: <parsed content>, noteId, creditsLeft }
      setResult(result.data);

      // Update stored user credits immediately so the UI reflects deduction
      if (userData) {
        dispatch(setUser({ ...userData, credits: result.creditsLeft }));
      }

      setClassLevel(""); 
      setExamType("");
      setRevisionMode(false);
      setIncludeDiagrams(false);
      setIncludeCharts(false);

    } catch (error) {
      console.error("Generate notes error:", error);

      const serverMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to generate notes.";

      // Check for quota-related errors and provide helpful message
      if (serverMessage.includes('quota') || serverMessage.includes('RESOURCE_EXHAUSTED') || serverMessage.includes('429')) {
        setError("AI service quota exceeded. Please try again in a few minutes, or upgrade your API plan at https://makersuite.google.com/app/apikey");
      } else {
        setError(serverMessage);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if(!loading) {
      setProgress(0);
      setProgressText("");
      return;
    }

    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 8;
      
      if(value >= 95) {
        value = 95;
        setProgressText("Almost there...");
        clearInterval(interval);
      }
      else if(value >=70) {
        setProgressText("Finalizing notes...");
      }
      else if(value >= 40) {
        setProgressText("Generating notes...");
      }
      else{
        setProgressText("Analyzing topic...");
      }

      setProgress(Math.floor(value));

    
    }, 700);

    return () => clearInterval(interval);

  },[loading])



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl 
      border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.1)] p-8 space-y-6 text-white'
    >

      <input
        type="text"
        className='w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg
        border border-white/20 placeholder-gray-400 text-white focus:outline-none 
        focus:ring-white/30'
        placeholder='Enter topic (e.g. Web Development)'
        onChange={(e) => setTopic(e.target.value)}
        value={topic}
      />

      <input
        type="text"
        className='w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg
        border border-white/20 placeholder-gray-400 text-white focus:outline-none 
        focus:ring-white/30'
        placeholder='Academic Level (e.g. Class 10th)'
        onChange={(e) => setClassLevel(e.target.value)}
        value={classLevel}
      />

      <input
        type="text"
        className='w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg
        border border-white/20 placeholder-gray-400 text-white focus:outline-none 
        focus:ring-white/30'
        placeholder='Examination Type (e.g. CBSE, JEE, NEET)'
        onChange={(e) => setExamType(e.target.value)}
        value={examType}
      />

      <div className='flex flex-row flex-wrap gap-6'>
        <Toggle label="Revision Mode" enabled={revisionMode} onChange={() => setRevisionMode(!revisionMode)} />
        <Toggle label="Include Diagrams" enabled={includeDiagrams} onChange={() => setIncludeDiagrams(!includeDiagrams)} />
        <Toggle label="Include Charts" enabled={includeCharts} onChange={() => setIncludeCharts(!includeCharts)} />
      </div>

      <motion.button
        onClick={handleSubmit}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold flex 
        items-center justify-center gap-3 transition 
        ${loading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-gradient-to-br from-white to-gray-200 text-black shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
        }`}
      >
        {loading ? "Generating..." : "Generate Notes"}
      </motion.button>

      <div className='mt-4 space-y-2'>

        <div className='w-full h-2 rounded-full bg-gray-600 overflow-hidden'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.6 }}
            className='h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
          >
          </motion.div>
        </div>

        <div className='flex justify-between text-xs text-gray-300'> 
          <span>{progressText}</span>
          <span>{progress}%</span>
        </div>
        <p className='text-xs text-gray-400 text-center'>
          This may take up to a minute. Please don't refresh.
        </p>
        
      </div>

    </motion.div>
  );
};

function Toggle({ label, enabled, onChange }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      className='flex items-center gap-4 cursor-pointer select-none'
      onClick={onChange}
    >
      <motion.div
        animate={{
          backgroundColor: enabled
            ? "rgba(44, 241, 116, 0.35)"
            : "rgba(255,255,255,0.15)"
        }}
        transition={{ duration: 0.25 }}
        className='relative w-12 h-6 rounded-full border border-white/20 backdrop-blur-lg'
      >

        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className='absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]'
          style={{ left: enabled ? "1.6rem" : "0.25rem" }}
        />

      </motion.div>

      <span className='text-sm'>{label}</span>

    </motion.div>
  );
}

export default TopicForm;