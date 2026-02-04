import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../../store/useChatStore";
import { Search, Users, X } from "lucide-react";


interface JoinRoomModalProps {
  onClose: () => void;
}

interface AvailableRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPublic: boolean;
}


const JoinRoomModal: React.FC<JoinRoomModalProps> = ({onClose}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
    const [loading, setLoading] = useState(false);
    const [joining, setJoining] = useState<string | null>(null);

    const navigate = useNavigate();
    const wsSend = useChatStore((state) => state.wsSend);
    const addRoom = useChatStore((state) => state.addRoom);
    const selectRoom = useChatStore((state) => state.selectRoom);


    // Search for rooms
    const handleSearch = async () => {
        setLoading(true);

        try {
          const response = await fetch(`http://localhost:3000/api/dms/search?q=${searchQuery}`, {
            headers: {
              'Authorizations': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const data = await response.json();
          setAvailableRooms(data.rooms)
          
        } catch (err) {
            console.error('Failed to search rooms:', err);
        } finally {
          setLoading(false);
        }
    }

    // Room Join
    const handleJoinRoom = async (room: AvailableRoom) => {
      setJoining(room.id);

      try {
        const response = await fetch(`http://localhost:3000/api/dms/${room.id}/join`, {
          method: 'POST',
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
          }
        });

        if(!response.ok) throw new Error("Failed to join the room");

        // const data = await response.json();

        //Add the room in store
        addRoom({
          id: room.id,
          name: room.name,
          lastMessage: ' ',
          timestamp: 'Just now',
          unread: 0
        });

        //Send WS join event
        if(wsSend) {
          wsSend({type: 'JOIN_ROOM', roomId:room.id})
        }

        selectRoom(room.id);
        // Modal close
        onClose();
        navigate(`room/${room.id}`)

      } catch (err) {
        console.error('Failed to join room:', err);
      }finally {
      setJoining(null);
    }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2D3436]">Join a Room</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for rooms..."
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A7E1] text-[#2D3436]"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#00A7E1] text-white rounded-lg hover:bg-[#0090C4] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto p-6">
              {availableRooms.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-[#2D3436] opacity-70">
                    {searchQuery ? 'No rooms found' : 'Search for rooms to join'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#00A7E1] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#2D3436]">{room.name}</h3>
                          {room.isPublic && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#2D3436] opacity-70 mb-2">
                          {room.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-[#2D3436] opacity-60">
                          <Users className="h-3 w-3" />
                          <span>{room.memberCount} members</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinRoom(room)}
                        disabled={joining === room.id}
                        className="ml-4 px-4 py-2 bg-[#00A7E1] text-white rounded-lg hover:bg-[#0090C4] disabled:opacity-50 transition-colors"
                      >
                        {joining === room.id ? 'Joining...' : 'Join'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    );
};

export default JoinRoomModal;