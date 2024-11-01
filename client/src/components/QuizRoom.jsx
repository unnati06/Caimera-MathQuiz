import React, { useState } from 'react';
import { useSocket } from "../contexts/SocketContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/QuizRoom.css';
const QuizRoom = () => {


    const navigate = useNavigate();
    const { roomCode, joinRoom } = useSocket();
    const [userRoomCode, setUserRoomCode] = useState('');
    const [userName, setUserName] = useState('');

    const handleJoinRoom = () => {
        if (userRoomCode && userName) {
            joinRoom(userRoomCode, userName);
            navigate('/dashboard')
        } else {
            alert('Please enter a room code and username');
        }
    };
  return (
    <div>
            <h1>Hello Math Geeks.</h1>
            
            {/* Display generated room code for reference */}
            {roomCode && (
                <div>
                    <p><strong>Generated Room Code:</strong> {roomCode}</p>
                    <p>Copy and paste this code to join the room.</p>
                </div>
            )}

            {/* Input field for user to enter the room code */}
            <input
                type="text"
                value={userRoomCode}
                onChange={(e) => setUserRoomCode(e.target.value)}
                placeholder="Enter Room Code"
            />
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter Your Name"
            />
            <button onClick={handleJoinRoom}>Join Room</button>
        </div>
  )
}

export default QuizRoom