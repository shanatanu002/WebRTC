import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/socket';
const Dash = () => {
    const {socket} = useSocket();
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();
    
    const handleRoomJoined = useCallback(({roomId}) => {
     navigate(`/room/${roomId}`);     //not working
    }, [navigate]);

    useEffect(()=>{
      socket.on("joined-room", handleRoomJoined);
      return() => {
             socket.off("joined-room", handleRoomJoined)
      };
    }, [handleRoomJoined, socket])

    const handleJoinRoom = () =>{
       socket.emit("join-room", {emailId: email, roomId})
    };
      return(
        <div className="w-full h-screen flex justify-center items-center">
         <div className="text-2xl">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className='block m-2 p-1 border-2 border-black rounded bg-white text-black' type="email" placeholder='Enter your email here'  />
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)} className='block m-2 p-1 border-2 border-black rounded bg-white text-black' type="text" placeholder = 'Enter the code here' />
          <button onClick={handleJoinRoom}className='block border-2 border-black m-2 p-1 bg-slate-400'>Enter Room</button>
         </div>
         
        </div>
      )
    
}

export default Dash