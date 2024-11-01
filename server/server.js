const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const mongoose = require('mongoose') 
require('dotenv').config();
const generateRandomQuestion = require('./utils/generateRandomQuestions');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Serve a simple HTML page
app.get('/', (req, res) => {
    res.send('running');
});



//mongo 
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const generateRoomCode = () => Math.random().toString(36).substring(2, 7).toUpperCase(); // Generates a 5-character code
let currentRoomCode = generateRoomCode();

let currentQuestion = generateRandomQuestion();

let answerSubmitted = false; 


// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);


    // Emit a welcome message to the client
    socket.emit('welcome', 'Welcome to the Socket.IO server!');
    socket.emit('roomCode', { roomCode: currentRoomCode });
    console.log({roomCode:currentRoomCode});


    socket.emit('newQuestion', { question: currentQuestion.question });
    console.log(`Generated Question: ${currentQuestion.question}`);


    socket.on('joinRoom', ({ roomCode, userName }) => {
        socket.join(roomCode); // Join the room based on roomCode
        console.log(`${userName} joined room: ${roomCode}`);

        // Notify others in the room that a new user joined
        socket.to(roomCode).emit('userJoined', { userName, roomCode });
        io.to(roomCode).emit('newQuestion', { question: currentQuestion.question });

    
    });

    //Handle submit answer
    socket.on('submitAnswer', ({ answer, userName }) => {
        console.log(`${userName} submitted: ${answer}`);
        if (!answerSubmitted && parseFloat(answer) === currentQuestion.answer) {
            answerSubmitted = true; // Mark as submitted to prevent multiple winners
            io.to(currentRoomCode).emit('winner', { winner: userName, correctAnswer: answer });
            console.log(`${userName} is the winner with the answer: ${answer}`);
          

            setTimeout(() => {
                currentQuestion = generateRandomQuestion(); // Generate a new question
                answerSubmitted = false; // Reset for the next question
                io.to(currentRoomCode).emit('newQuestion', { question: currentQuestion.question });
                console.log(`New Question Generated: ${currentQuestion.question}`);
            }, 20000); // 20 seconds delay
        } else {
            // Optionally broadcast the wrong answer
            io.to(currentRoomCode).emit('answerSubmitted', { answer, userName });
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
