import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

// import Home from './pages/Home'
// import Contact from './pages/Contact'
import ComingSoon from './pages/ComingSoon';

function App() {

  return (
    <>
      <Routes>
        <Route index element={<ComingSoon />} />
        {/* {<Route path="/contact" element={<Contact />} />} */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
