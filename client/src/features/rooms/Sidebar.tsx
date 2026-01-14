import { Search } from "lucide-react";


export const Sidebar = ({ rooms, selectedRoom, onRoomSelect, wsStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <ConnectionStatus status={wsStatus} />

      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map(room => (
          <RoomListItem
            key={room.id}
            room={room}
            isSelected={selectedRoom?.id === room.id}
            onClick={() => onRoomSelect(room)}
          />
        ))}
      </div>
    </div>
  );
};
