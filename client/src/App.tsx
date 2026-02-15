import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MessengerUI from './pages/MessengerUI'
import './style.css'
import { useWebSocket } from './hooks/useWebSocket'
import { useChatStore } from './store/useChatStore';
import { useCallback, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './features/components/ProtectedRoute';
import RegisterPage from './features/auth/RegisterPage';
function App() {
  const token = useAuthStore((state)=> state.token);
  const isAuthenticated = useAuthStore((state)=> state.isAuthenticated);
  const setWsSend = useChatStore((state) => state.setWsSend);
  const fetchRooms = useChatStore((state)=> state.fetchRooms);
  const roomsLoading = useChatStore((state) => state.roomsLoading);
  const roomsError = useChatStore((state) => state.roomsError);
  const { sendMessage } = useWebSocket('ws://localhost:3000', token || '');


  //Store send function on Zustand store
  useEffect(()=> {
    if(isAuthenticated && token) {
      console.log('Fetching rooms...');
      
      fetchRooms(token);
      setWsSend(sendMessage)
    }
  }, [sendMessage, fetchRooms, setWsSend, isAuthenticated, token])

  // if(roomsLoading) {
  //   return (
  //     <div   className="h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A7E1] mx-auto mb-4"></div>
  //         <p className="text-[#2D3436]">Loading your conversations...</p>
  //       </div>
  //     </div>
  //   )
  // }

  //   if (roomsError) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-red-500 mb-4">{roomsError}</p>
  //         <button
  //           onClick={() => token && fetchRooms(token)}
  //           className="px-4 py-2 bg-[#00A7E1] text-white rounded-lg"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <BrowserRouter>
      <Routes>
          {/* Public routes */}
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>

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
