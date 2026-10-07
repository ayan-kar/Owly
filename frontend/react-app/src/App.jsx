import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import './App.css'
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import GuestLogin from "./pages/GuestLogin"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MeetCompo from "./pages/Meet.jsx"
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <Router> {/* it connects your React app to the browser's address bar and history ,React has no idea what URL the user is currently on.  */}
  <AuthProvider>
        <Routes>
          <Route path='' element={<LandingPage />} />
          <Route path='/home' element={<LandingPage />} />
          <Route path='/guest-login' element={<GuestLogin />} />
          <Route path='/services' element={<Services />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/owl/:id' element={<MeetCompo />} />
        </Routes>
    </AuthProvider>
      </Router>
    </>
  )
}

export default App
