import { Room } from "../../../types/chat.types";


interface RoomListItemProps {
  room: Room;
  isSelected: boolean;
  onClick: () => void;
}

export const RoomListItem: React.FC<RoomListItemProps> = ({ room, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
      isSelected ? 'bg-blue-50' : ''
    }`}
  >
    <div className="flex items-start">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
        {room.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
          <span className="text-xs text-gray-500 ml-2">{room.timestamp}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
          {room.unread > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {room.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);