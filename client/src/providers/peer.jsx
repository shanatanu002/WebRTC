import React, {useMemo, useEffect, useState, useCallback} from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
    const[remoteStream, setRemoteStream] = useState(null);
    const peer = useMemo(() => new RTCPeerConnection( {
        iceServers: 
               [
                 {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
            ],
            }
          ]         
    }), []);

    const createOffer = async() => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
    }
   
   const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer); //since it is not my own offer therefore it is stored in remoteDescription otherwise localDescription  
    const answer = await peer.createAnswer(); //creating the answer
    await peer.setLocalDescription(answer); //now storing the answer in local description
    return answer;
   } ;

   const setRemoteAnswer = async(ans) => {
    await peer.setRemoteDescription(ans);
   }; 
   const sendStream = async(stream) => {
            const tracks = stream.getTracks();
            for(const track of tracks){
                peer.addTrack(track, stream); //extracts the tracks of stream and sends it to the peer
            }
        };
     
    const handleTrackEvent = useCallback((ev) =>{
        const streams = ev.streams;
        setRemoteStream(streams[0]) // we will have multiple streams of the user and we'll pick up its 0th element
    }, [])   //it is necessary to create these function seperately and not inside useEffect() but instead remove the eventListener inside useEffect as all these event listeners keeps regestering and it may hang the app 
    
    
    useEffect(() => {
        peer.addEventListener('track',handleTrackEvent);   
        return () => {
            peer.removeEventListener('track', handleTrackEvent);     
        };
    },[handleTrackEvent, peer])
   
    return(
        <PeerContext.Provider value={{peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream}}>
            {props.children}
            </PeerContext.Provider>
    );
};
