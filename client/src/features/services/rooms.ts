import { AuthToken, RoomId } from "@/types/ids";


// service function for room fetch 
export async function fetchRoomsFromServer( token:AuthToken ) {
    // console.log(token);
    
    const response = await fetch('http://localhost:3000/api/dms',{
        headers:{
            'Authorization': `Bearer ${token}` 
        }
    });
    
    if(!response.ok) {
        throw new Error("Failed to fetch rooms")
    }
    
    const data = await response.json();

    return data;
}

//function to fetch Rooms messages from backend 
export async function fetchRoomMessages( token: AuthToken, roomId: RoomId ) {
    const response = await fetch(`http://localhost:3000/api/rooms/${roomId}/messages`, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw new Error("Failed to fetch rooms")
    }

    const data = await response.json();

    return data;


}