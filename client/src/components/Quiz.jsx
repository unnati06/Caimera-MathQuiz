import React, {useEffect, useState} from 'react'
import { useSocket } from '../contexts/SocketContext';
const Quiz = () => {

    const { question, socket, winner , userName, userPoints} = useSocket();
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        // Listen for new questions from the server
        socket.on('newQuestion', ({ question }) => {
            setCurrentQuestion(question); // Set the current question received from the server
            setUserAnswer(''); // Reset user answer when a new question arrives
        });

    
        // Clean up event listener on unmount
        return () => {
            socket.off('newQuestion');
            socket.off('answerResult');
        };
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        if (userAnswer.trim()) {
            // Emit the submitted answer to the server
            socket.emit('submitAnswer', { answer: userAnswer, userName}); // Replace 'YourUserName' with actual user data
            
            setUserAnswer(''); // Clear the input field after submitting
        }
    };
    console.log(userName);
    
    return (
        <div className='quiz'>
          <h1>Enjoy, maths </h1>
          <h2>
            Welcome, <span>{userName}</span>! You have successfully joined the room.
          </h2>
    
          <div>
            <h3>Current Question:</h3>
            <p>
              {question || "No question available"}
            </p>
          </div>
          {winner && (
                <div className="winner-announcement">
                    <h2>Winner: {winner.name}</h2>
                    
                </div>
            )}
          <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here"
                    required
                />
                <button type="submit">Submit Answer</button>
            </form>
           
     
        </div>
      );
  
}

export default Quiz
