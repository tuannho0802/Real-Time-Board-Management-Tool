const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./services/firebase");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

//socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const boardRoutes = require("./routes/board.routes");
const cardRoutes = require("./routes/card.route");
const inviteRoutes = require("./routes/invite.route");
const taskRoutes = require("./routes/task.route");
const githubRoutes = require("./routes/github.route");

app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/boards", cardRoutes);
app.use("/boards", inviteRoutes);
app.use("/boards", taskRoutes);
app.use("/", githubRoutes);

io.on("connection", (socket) => {
  console.log(
    "New client connected:",
    socket.id
  );

  socket.on("join-card", (cardId) => {
    socket.join(`card-${cardId}`);
    console.log(`Joined card ${cardId}`);
  });

  socket.on("leave-card", (cardId) => {
    socket.leave(`card-${cardId}`);
    console.log(`Left card ${cardId}`);
  });

  socket.on("disconnect", () => {
    console.log(
      "Client disconnected:",
      socket.id
    );
  });
});

// Swagger API docs
const {
  swaggerSpec,
  swaggerUi,
} = require("./swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
  res.send("Skipli backend is running...");
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});
