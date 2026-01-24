import { ArrowLeft, MoreVertical, Users } from "lucide-react";
import { Room } from "../../types/chat.types";


interface ChatHeaderProps {
  room: Room;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ room, onBack }) => (
  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
    <div className="flex items-center">
      <button 
        className="lg:hidden mr-3 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
        {room.name[0]}
      </div>
      <div>
        <h2 className="font-semibold text-gray-900">{room.name}</h2>
        <p className="text-sm text-gray-500">Active now</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
        <Users className="h-5 w-5" />
      </button>
      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  </div>
);