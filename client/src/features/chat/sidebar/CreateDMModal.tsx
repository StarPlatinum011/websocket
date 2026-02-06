import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";




interface AvailableRoom {
  id: string;
  username: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
}

export const CreateDMModal = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
    const [loading, setLoading] = useState(false);
    const [joining, setJoining] = useState<string | null>(null);

    const wsSend = useChatStore((state) => state.wsSend);
    const addRoom = useChatStore((state) => state.addRoom);
    const selectRoom = useChatStore((state) => state.selectRoom);
    const isJoinRoomModalOpen = useChatStore((state)=> state.isJoinRoomModalOpen);
    const setJoinRoomModalOpen = useChatStore((state)=> state.setJoinRoomModalOpen);
    const token = useAuthStore((state) => state.token)

    const navigate = useNavigate();

     // Search for rooms
    const handleSearch = async () => {
        setLoading(true);

        try {
          const response = await fetch(`http://localhost:3000/api/dms/search?q=${searchQuery}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
              {console.log(data, 'Backend availableRooms')}

          setAvailableRooms(data.users || []) //Because on this version 1.0 we are sending users
          
        } catch (err) {
            console.error('Failed to search rooms:', err);
        } finally {
          setLoading(false);
        }
    }

    {console.log(availableRooms[0].username, 'availableRooms')}

    // Room Join
    const handleStartDM = async (room: AvailableRoom) => {
      setJoining(room.id);

        try {
            const response = await fetch(`http://localhost:3000/api/dms/create`, {
                method: 'POST',
                headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json'
                }
            });

            if(!response.ok) throw new Error("Failed to join the room");

            const data = await response.json();

            //Add the room in store
            if(data.isNew) {
                addRoom({
                id: data.room.id,
                type: 'DM',
                name: data.room.name,  // Other user's name
                lastMessage: '',
                timestamp: 'Just now',
                unread: 0,
                memberHash: data.room.memberHash,
                otherUser: data.room.otherUser

                });

            }

            //Send WS join event
            if(wsSend) {
                wsSend({type: 'JOIN_ROOM', roomId:data.room.id})
            }

            selectRoom(data.room.id);
            
            navigate(`room/${data.room.id}`)

        } catch (err) {
            console.error('Failed to join room:', err);
        }finally {
            setJoining(null);
        }
    } 

  return (
    <Dialog
      open={isJoinRoomModalOpen}
      onOpenChange={setJoinRoomModalOpen}
    >
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add friends</DialogTitle>
          <DialogDescription>
            Connect with new people and start chatting. 
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="Enter username or email"
               type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search people..."
            />
            <Button 
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#F7A072]"
            >
                {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
            {availableRooms.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-[#2D3436] opacity-70">
                    {searchQuery ? 'No users found' : ''}
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
                          <h3 className="font-semibold text-[#2D3436]">{room.username}</h3>
                          {!room.isPrivate && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#2D3436] opacity-70 mb-2">
                          {room.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-[#2D3436] opacity-60">
                          <Users className="h-2 w-2" />
                          <span>{room.username} </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartDM(room)}
                        disabled={joining === room.id}
                        className="ml-4 px-2 py-1.5 bg-[#00A7E1] text-white rounded-lg hover:bg-[#0090C4] disabled:opacity-50 transition-colors"
                      >
                        {joining === room.id ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              )} 

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
