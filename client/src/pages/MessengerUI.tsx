import { useEffect, useState } from "react";
import { ChatArea } from "../features/chat/ChatArea/ChatArea";
import { Sidebar } from "../features/chat/sidebar/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import StartDMModal from "../features/chat/sidebar/StartDMModal";

const MessengerUI: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const selectedRoomId = useChatStore((state) => state.selectedRoomId)
  const setRoomSelect = useChatStore((state) => state.selectRoom)
  const isJoinRoomModalOpen = useChatStore((state)=> state.isJoinRoomModalOpen);
  const setJoinRoomModalOpen = useChatStore((state)=> state.setJoinRoomModalOpen);

  useEffect(()=> {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  //On back button pressed
  const handleBackToRooms = () => {
    setRoomSelect(null);
    navigate('/');
  }

  return (
    <div className=" h-screen bg-gray-100 flex">
      {isMobile? (
        // Remder Mobile view with selectedRoom condition
        <> 
          {!selectedRoomId? (
            <Sidebar />
          ) : (
            <ChatArea onBack ={handleBackToRooms}/>
          )}
        </>
      ) : (
         //Render Desktop view
        <>
          <Sidebar />
          <ChatArea />
        </>
      )}

      {/* Modal for adding a new user  */}
      {isJoinRoomModalOpen && (
        <StartDMModal onClose={() => setJoinRoomModalOpen(false)} />
      )}
    </div>
  );
};

export default MessengerUI;