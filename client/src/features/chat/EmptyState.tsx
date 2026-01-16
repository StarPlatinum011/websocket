import { Users } from "lucide-react";


export const EmptyState: React.FC = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
      <p className="text-gray-600">Choose a room from the sidebar to start messaging</p>
    </div>
  </div>
);