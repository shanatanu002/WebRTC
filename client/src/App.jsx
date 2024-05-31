import { useState } from 'react'
import { Routes, Route} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { SocketProvider } from './providers/socket.jsx';
import { PeerProvider } from './providers/peer.jsx';

import Dash from "./pages/Dash.jsx";
import Room from './pages/Room.jsx';

function App() {

  return (
    <>
    <div className='App'>
    <SocketProvider>
      <PeerProvider>
    <Routes>  
    <Route path ="/" element={<Dash/>}/>
    <Route path="/room/:roomId" element={<Room/>} /> 
    </Routes>
    </PeerProvider>
    </SocketProvider>
    </div>
    </>
  )
}

export default App
