import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket] = useState(() => io('https://caimera-mathquiz.onrender.com')); // Here I connected to the backend server
    const [roomCode, setRoomCode] = useState('');
    const [question, setQuestion] = useState('');
    const [winner, setWinner] = useState(null);
    const [userName, setUserName] = useState(''); 
    const [userPoints, setUserPoints] = useState(0);
    useEffect(() => {
        // Listen for the room code from the server
        socket.on('roomCode', ({ roomCode }) => {
            console.log("Received room code from server:", roomCode); // Log the received room code
            setRoomCode(roomCode); // Save the room code to be accessible across the app
        });

        //listen for new question
        socket.on('newQuestion', ({ question }) => {
            console.log("Received question from server:", question); // Log the received question
            setQuestion(question); // Save the question to be accessible across the app
            setWinner(null);

        });
        
        //for winner
        socket.on('winner', ({ winner, correctAnswer }) => {
            console.log(`${winner} is the winner with the answer: ${correctAnswer}`);
            setWinner({ name: winner, answer: correctAnswer }); // Set the winner state


            setTimeout(() => setWinner(null), 20000);

            
        });

        
        return () => socket.off('roomCode'); // Clean up event listener on unmount
        socket.off('newQuestion');
        socket.off('winner');
    }, [socket]);

    const joinRoom = (roomCode, userName) => {
        socket.emit('joinRoom', { roomCode, userName });
        setUserName(userName);
      };
    return (
        <SocketContext.Provider value={{ socket, roomCode,  question, joinRoom, winner, userName, userPoints }}>
            {children}
        </SocketContext.Provider>
    );
};
