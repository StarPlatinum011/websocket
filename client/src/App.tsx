import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MessengerUI from './pages/MessengerUI'
import './style.css'
import { useWebSocket } from './hooks/useWebSocket'
import { useChatStore } from './store/useChatStore';
import { useEffect } from 'react';
function App() {
  const { sendMessage } = useWebSocket('ws://localhost:3000', 'my-auth-token');
  const setWsSend = useChatStore((state) => state.setWsSend);

  //Store send function on Zustand store
  useEffect(()=> {
    setWsSend(sendMessage);
  }, [sendMessage, setWsSend])

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
