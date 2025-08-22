const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require("http");
const { Server } = require("socket.io");

// 1️⃣ Initialize express first
const app = express();

// 2️⃣ Create HTTP server
const server = http.createServer(app);

// 3️⃣ Initialize socket.io after server
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true }
});

// Optional: make io accessible in routes
app.set("io", io);

// 4️⃣ Socket.io connections
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // When frontend joins a bus room
  socket.on("joinBus", (busId) => {
    console.log(`🔹 Socket ${socket.id} joining room: ${busId}`);
    socket.join(busId);
  });

  // When bus sends location
  socket.on("busLocation", (data) => {
    console.log("📍 Received busLocation from client:", data);

    let loc;
    try {
      // Ensure data is JSON object or parse string
      loc = typeof data === "string" ? JSON.parse(data) : data;
      console.log("🟢 Parsed location:", loc);

      if (!loc.busId || !loc.lat || !loc.lng) {
        console.warn("⚠️ Invalid location format", loc);
        return;
      }

      const busRoom = loc.busId.toUpperCase();
      io.to(busRoom).emit("locationUpdate", loc);
      console.log(`🚀 Emitted locationUpdate to room ${busRoom}`);
    } catch (err) {
      console.error("❌ Error parsing location:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// 5️⃣ Config dotenv & connect DB
dotenv.config();
connectDB();

// 6️⃣ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// 7️⃣ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 8️⃣ Start server using http server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
