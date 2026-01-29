import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MessengerUI from './pages/MessengerUI'
import './style.css'
import { useWebSocket } from './hooks/useWebSocket'
import { useChatStore } from './store/useChatStore';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './features/components/ProtectedRoute';
function App() {
  const token = useAuthStore((state)=> state.token);
  const isAuthenticated = useAuthStore((state)=> state.isAuthenticated);
  const setWsSend = useChatStore((state) => state.setWsSend);

  const { sendMessage } = useWebSocket('ws://localhost:3000', token || '');


  //Store send function on Zustand store
  useEffect(()=> {
    if(isAuthenticated) {
      setWsSend(sendMessage)
    }
  }, [sendMessage, setWsSend, isAuthenticated])

  return (
    <BrowserRouter>
      <Routes>
          {/* Public routes */}
          <Route path='/login' element={<LoginPage/>}/>

          {/* Protected Routes  */}
          <Route 
            path="/" 
            element={
            <ProtectedRoute>    
              <MessengerUI />
            </ProtectedRoute>
          } 
          />
          <Route 
            path="/room/:roomId"  
            element={
              <ProtectedRoute>
                <MessengerUI />
              </ProtectedRoute>
            } 
          />
          <Route path="/404" element={<div>404 Not Found.</div>} />
          <Route path="*" element={<Navigate to={'/404'} replace/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
