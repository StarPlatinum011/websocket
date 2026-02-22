

// service function for room fetch 
export async function fetchRoomsFromServer( token:string ) {
    console.log(token);
    
    const response = await fetch('http://localhost:3000/api/dms',{
        headers:{
            'Authorization': `Bearer ${token}` 
        }
    });
    console.log('Response: ', response);
    
    if(!response.ok) {
        throw new Error("Failed to fetch rooms")
    }
    
    const data = await response.json();
    console.log('Response Data: ', data);

      return data;
}