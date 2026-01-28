import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MessengerUI from './pages/MessengerUI'
import './style.css'
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MessengerUI />} />
          <Route path="/room/:roomId" element={<MessengerUI />} />
          <Route path="/404" element={<div>404 Not Found.</div>} />
          <Route path="*" element={<Navigate to={'/404'} replace/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
