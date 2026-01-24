

interface ConnectionStatusProps {
  status: 'Offline' | 'Online';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => (
  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
    <div className="flex items-center text-sm">
      <div className={`w-2 h-2 rounded-full mr-2 ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-gray-600">{status === 'Online' ? 'Online' : 'Offline'}</span>
    </div>
  </div>
);