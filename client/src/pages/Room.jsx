import React, {useCallback, useEffect, useState} from "react";
import ReactPlayer from 'react-player'
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/peer";

const Room = () => {
    const{socket} = useSocket();
    const{peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream} = usePeer(); //a custom hook for creating the offer

    const[myStream, setMyStream] = useState(null); //my stream
    const[remoteEmailId, setRemoteEmailId] = useState();
    
const handleNewUserJoined = useCallback(async (data) => {
    const {emailId} = data;
    console.log("New user joined room", emailId);
    const offer = await createOffer();
    socket.emit("call-user", {emailId, offer});
    setRemoteEmailId(emailId)
},
[createOffer, socket] 
);

const handleIncomingCall = useCallback(async (data) => {
  const {from, offer} = data;
  console.log("Incoming Call from", from, offer);
  const ans  = await createAnswer(offer);
  socket.emit('call-accepted', { emailId: from, ans});
  setRemoteEmailId(from);
}, [createAnswer, socket]);

const handleCallAccepted = useCallback(async(data) => {
 const {ans} = data;
 console.log('Call Got Accepted', ans);
 await setRemoteAnswer(ans);
}, [setRemoteAnswer]
);

const getUserMediaStream = useCallback(async() =>{
 const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: true, 
    video: true, 
});
   //before sending the stream it has to be set
  
   setMyStream(stream);
}, []);

const handleNegotiation = useCallback(async() => {
    console.log("negotiate")
    const localOffer = await peer.localDescription;
    socket.emit('call-user', {emailId: remoteEmailId, offer: localOffer});
}, []);


useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);// this event will be called everytime it is re-rendered 
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    

    return () => {
    socket.off('user-joined', handleNewUserJoined) //it will turn off this event and not listen after it is called once
    socket.off('incoming-call', handleIncomingCall)   
    socket.off('call-accepted', handleCallAccepted)
}

}, [handleIncomingCall, handleNewUserJoined ,socket]);

useEffect(() => {
    peer.addEventListener('negotiationNeeded', handleNegotiation);
    return () => {
        peer.removeEventListener('negotiationNeeded', handleNegotiation) ; 
    }
}, [])

useEffect(() => {
    getUserMediaStream();
}, [getUserMediaStream])

return(

    <div className="">
      <h1>Room Page</h1>
      <h4>You are connected to {remoteEmailId}</h4>
      <button onClick={e => sendStream(myStream)}>Send my stream</button>
      <ReactPlayer url={myStream} playing muted/>
      <ReactPlayer url={remoteStream} playing muted/>
    </div>
 );
};

export default Room