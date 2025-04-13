const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');  // Import the connectDB function
const bodyParser = require('body-parser');
const routes = require('./routes/indexRoutes');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers')
const cookieParser = require("cookie-parser");
const {Server} = require('socket.io')
const http = require('http');
const { createNotification } = require('./controllers/notifications/notificationController');
require('dotenv').config();


const app = express();
const server = http.createServer(app)
// Middlewares
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const io = new Server(server, {
    cors:{
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
    pingTimeout: 60000,  // Disconnect after 60s of inactivity
    pingInterval: 25000, 
})

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));

app.use('/api/stripe-webhook', bodyParser.raw({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB using connectDB function
connectDB();  // This will handle the MongoDB connection
// Serve static files from the 'assets' folder
// app.use(express.static(path.join(__dirname, 'assets', 'images')));

// Use product routes
app.use('/', routes);
app.use("/uploads", express.static("uploads"));

// Set up Apollo Server with GraphQL schema and resolvers
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }) // You can add authentication logic here
});

// Start Apollo Server and apply middleware
async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    console.log(`🚀 Apollo Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer();

let onlineUsers = new Map();
global.onlineUsers = onlineUsers


io.on("connection", (socket) => {
    console.log("New Client Connected", socket.id);

    socket.on("register", ({ sellerId, role }) => {
        if (!sellerId) return console.error("⚠️ Missing sellerId during registration");

        onlineUsers.set(sellerId, { socketId: socket.id, role });
        console.log("✅ User registered:", onlineUsers);
    });

    socket.on("sendNotification", async ({ receiverId, message, type }) => {
        try {
            if (!receiverId || !message || !type) {
                console.error("Invalid notification data:", { receiverId, message, type });
                return;
            }

            const receiver = onlineUsers.get(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("receiveNotification", { message, type });
            }

            await createNotification({ receiverId, message, type });
        } catch (error) {
            console.error("Error saving notification:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected ${socket.id}`);
        let removedUser = null;
        
        onlineUsers.forEach((value, key) => {
            if (value.socketId === socket.id) {
                removedUser = key;
                onlineUsers.delete(key);
            }
        });
    
        console.log(`❌ Removed user: ${removedUser || "None"}`);
        console.log("Updated online users:", onlineUsers);
    });

    socket.on("logout", (sellerId) => {
        console.log(`🔴 Logging out user: ${sellerId}`);
    
        if (sellerId && onlineUsers.has(sellerId)) {
            onlineUsers.delete(sellerId);
            console.log(`❌ User removed from online users: ${sellerId}`);
        }
    
        socket.disconnect(); // Ensure disconnection
        console.log("🔌 Socket forcefully disconnected.");
    });    
    
});



// Start the server
const PORT = process.env.PORT || 5000;
global.io = io;
module.exports = { app, server };
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

