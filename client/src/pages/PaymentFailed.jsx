import React from 'react';
import { motion } from "motion/react";
import { FiCheckCircle } from "react-icons/fi";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { FaRegTimesCircle } from "react-icons/fa";

function PaymentFailed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const reason = query.get('reason') || 'failed';

  useEffect(() => {
    getCurrentUser(dispatch);

    const t = setTimeout(() => {
      navigate("/price");
    }, 5000);

    return () => clearTimeout(t);

  }, []);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 gap-4'>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
        className="text-red-500 text-6xl"
      >
        <FaRegTimesCircle />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-bold text-red-600"
      >
        Payment Failed! Please Try Again
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className='text-gray-500 text-sm'>
        {reason === 'cancelled'
          ? 'Payment was cancelled. Redirecting to Buy Credits page...'
          : 'Payment failed. Redirecting to Buy Credits page...'}
      </motion.p>
    </div>
  );
}

export default PaymentFailed;