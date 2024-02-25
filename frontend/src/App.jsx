
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'
import axios from 'axios'
axios.defaults.withCredentials = true
function App() {
  const { authUser } = useAuthContext()
  return (

    <div className='p-4 h-scren flex items-center justify-center'>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={authUser ? <Navigate to={'/'} /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to={'/'} /> : <SignUp />} />

      </Routes>
      <Toaster />

    </div>
  )
}

export default App
