import { LogOut, Search } from "lucide-react";
import { RoomListItem } from "./RoomListItem";
import { useState } from "react";
import { ConnectionStatus } from "./ConnectionStatus";
import { useChatStore } from "../../../store/useChatStore";
import { Room } from "../../../types/chat.types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";


export const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const rooms = useChatStore((state) => state.rooms);
  const wsStatus = useChatStore((state) => state.wsStatus)
  const selectedRoomId = useChatStore((state)=> state.selectedRoomId)
  const selectRoom = useChatStore((state) => state.selectRoom)
  const clearUnread = useChatStore((state) => state.clearUnread);
  const wsSend = useChatStore((state)=> state.wsSend);
  const logout = useAuthStore((state) => state.logout);
  const userName = useAuthStore((state)=> state.userName)

  const navigate = useNavigate()

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login')
  }
  //Handle room selection
  const handleRoomSelect = (room: Room) => {
    selectRoom(room.id);
    clearUnread(room.id);
    
    if(wsSend) {
      wsSend({type: "JOIN_ROOM", roomId:room.id})
    }
    navigate(`/room/${room.id}`);


  }
  
  console.log("ConnectionStatus: ", wsStatus);
  return (
    <div className="lg:w-80 bg-white lg:border-r w-full border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Enigma</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>


      <ConnectionStatus status={wsStatus} />

      <div className="flex-1 overflow-y-auto border-b border-gray-200">
        {filteredRooms.map(room => (
          <RoomListItem
            key={room.id}
            room={room}
            isSelected={selectedRoomId === room.id}
            onClick={() => handleRoomSelect(room)}
          />
        ))}
      </div>
      <button
          onClick={handleLogout}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full flex items-center gap-2 cursor-pointer "
          title="Logout"
        > 
          <LogOut className="h-5 w-5" /> <span className="font-semibold">logout</span>
        </button>
  </div>
  );
};
