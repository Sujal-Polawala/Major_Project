const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const routes = require("./routes/indexRoutes");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const axios = require("axios"); // Added axios for proxying requests
const { spawn } = require("child_process"); // For spawning Python process
const socketIoClient = require("socket.io-client"); // To connect to Flask Socket.IO
const {
  createNotification,
} = require("./controllers/notifications/notificationController");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://major-project-three-beta.vercel.app",
  "https://trynbuy-admin.vercel.app", "https://trynbuy-backend.onrender.com",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api/stripe-webhook", bodyParser.raw({ type: "application/json" }));
app.use(bodyParser.json({ limit: "10mb" })); // Increased limit for image data
app.use(express.json());
app.use(cookieParser());

connectDB();
app.use("/", routes);
app.use("/uploads", express.static("uploads"));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  console.log(
    `🚀 Apollo Server ready at https://major-project-three-beta.vercel.app/graphql`
  );
}

startApolloServer();

let onlineUsers = new Map();
global.onlineUsers = onlineUsers;

// ======= New: Spawn Python Flask app as child process =======
const PYTHON_PORT = 5000;
const PYTHON_SCRIPT = "app.py";

console.log("Starting Python Flask server...");
const pythonProcess = spawn("python", [PYTHON_SCRIPT], {
  env: { ...process.env, PORT: PYTHON_PORT.toString() },
  stdio: ["ignore", "pipe", "pipe"],
});

pythonProcess.stdout.on("data", (data) => {
  console.log(`[Python stdout] ${data.toString()}`);
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`[Python stderr] ${data.toString()}`);
});

pythonProcess.on("close", (code) => {
  console.log(`Python process exited with code ${code}`);
});

// Simple wait function (you can improve this with health checks)
const waitForPythonServer = () =>
  new Promise((resolve) => setTimeout(resolve, 4000));

// ======= Proxy /tryon POST requests to Flask backend =======
app.post("/tryon", async (req, res) => {
  try {
    const response = await axios.post(
      `https://trynbuy-backend.onrender.com/tryon`,
      req.body
    );
    console.log("Forwarded /tryon request to Flask backend");
    console.log("Response from Flask backend:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding /tryon:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ======= Connect Node Socket.IO server with Flask Socket.IO backend =======
(async () => {
  await waitForPythonServer();

  const flaskSocket = socketIoClient(`https://trynbuy-backend.onrender.com`, {
    transports: ["websocket"],
  });

  flaskSocket.on("connect", () => {
    console.log("Connected to Flask Socket.IO backend");
  });

  io.on("connection", (socket) => {
    console.log("New Client Connected", socket.id);

    // Your existing user register and notification events
    socket.on("register", ({ sellerId, role }) => {
      if (!sellerId)
        return console.error("⚠️ Missing sellerId during registration");
      onlineUsers.set(sellerId, { socketId: socket.id, role });
      console.log("✅ User registered:", onlineUsers);
    });

    socket.on("sendNotification", async ({ receiverId, message, type }) => {
      try {
        if (!receiverId || !message || !type) {
          console.error("Invalid notification data:", {
            receiverId,
            message,
            type,
          });
          return;
        }
        const receiver = onlineUsers.get(receiverId);
        if (receiver) {
          io.to(receiver.socketId).emit("receiveNotification", {
            message,
            type,
          });
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

      socket.disconnect();
      console.log("🔌 Socket forcefully disconnected.");
    });

    // ======= New: Relay tryon events between Node and Flask Socket.IO =======
    socket.on(
      "tryon_request",
      async ({ userImage, productImage, category }) => {
        try {
          // Forward to Python backend or ML model
          const result = await axios.post("https://major-project-three-beta.vercel.app/tryon", {
            userImage,
            productImage,
            category,
          });
          console.log("Received tryon result from Flask backend:", result.data);

          socket.emit("tryon_result", { resultImage: result.data.resultImage });
        } catch (error) {
          socket.emit("tryon_error", { error: error.message });
        }
      }
    );

    flaskSocket.on("tryon_result", (data) => {
      // Broadcast result from Flask to all clients
      io.emit("tryon_result", data);
    });

    flaskSocket.on("tryon_error", (data) => {
      // Broadcast errors from Flask to all clients
      io.emit("tryon_error", data);
    });
  });
})();

// Cleanup Python process on Node exit
process.on("exit", () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});
process.on("SIGINT", () => {
  process.exit();
});
process.on("SIGTERM", () => {
  process.exit();
});

// Start the server
const PORT = process.env.PORT || 5000;
global.io = io;

module.exports = { app, server };
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
