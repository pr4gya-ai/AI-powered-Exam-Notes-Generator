import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import History from './pages/History'
import Notes from './pages/Notes'
import Price from './pages/Price'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import './index.css'
import { getCurrentUser } from './services/api.js'
import { useDispatch, useSelector } from 'react-redux'

export const serverURL = "https://ai-powered-exam-notes-generator-server-k96g.onrender.com"


function App() {
  // const serverURL = "http://localhost:8000"

  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {

      // Only call API if Redux has no user
      if (!userData) {
        await getCurrentUser(dispatch)
      }

      setLoading(false)
    }

    fetchUser()

  }, [dispatch, userData])   // ✅ added userData

  console.log("Current user data:", userData)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>

      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/auth"
        element={!userData ? <Auth /> : <Navigate to="/" replace />}
      />
  
      <Route
        path="/history"
        element={userData ? <History /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/notes"
        element={userData ? <Notes /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/price"
        element={userData ? <Price /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/payment-success" element={<PaymentSuccess/>}
      />

      <Route
        path="/payment-failed" element={<PaymentFailed/>}
      />

    </Routes>
  )
}

export default App
