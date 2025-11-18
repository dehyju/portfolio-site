import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

// import Home from './pages/Home'
// import Contact from './pages/Contact'
import ComingSoon from './pages/ComingSoon';

function App() {

  const navigate = useNavigate();
  return (
    <>
      <Routes location="/">
        <Route index element={<ComingSoon />} />
        {/* {<Route path="/contact" element={<Contact />} />} */}
        <Route path='*' element={<>{navigate("/")}</>} />
      </Routes>
    </>
  )
}

export default App
