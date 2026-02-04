import { Plus, Users } from "lucide-react";
import JoinRoomModal from "../sidebar/JoinRoomMOdal";
import { useChatStore } from "../../../store/useChatStore";


export const EmptyState: React.FC = () => {
  const isJoinRoomModalOpen = useChatStore((state) => state.isJoinRoomModalOpen);
  const setJoinRoomModalOpen = useChatStore((state)=> state.setJoinRoomModalOpen)
  return(

  <div className="flex-1 flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[#2D3436] mb-2">
            Select a conversation
          </h2>
          <p className="text-[#2D3436] opacity-70 mb-6">
            Choose a room from the sidebar or join a new one
          </p>
          <button
            onClick={() => setJoinRoomModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-[#00A7E1] text-white rounded-lg hover:bg-[#0090C4] transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Join Room
          </button>
        </div>
        
        {/* Join Room Modal */}
        {isJoinRoomModalOpen && (
          <JoinRoomModal onClose={() => setJoinRoomModalOpen(false)} />
        )}
      </div>
  )
};