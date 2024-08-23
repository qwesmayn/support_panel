import express, { json } from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler.js";
import routerUserAdmin from "./routes/userAdminRoutes.js";
import routerUser from "./routes/userRoutes.js";
import routerTicket from "./routes/ticketRoutes.js";
import { configServer } from "./configInclude/server-config.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { start } from "./init/initFirstAdmin.js";
import onConnection from "./socket_io/onConnection.js";
import { secureConfig } from "./configInclude/secure-config.js";
import jwt from 'jsonwebtoken';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

const { ALLOWED_ORIGIN, port } = configServer;

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use('/files', express.static(path.join(__dirname, 'files')));

app.use("/api/user-admin", routerUserAdmin);
app.use("/api/user", routerUser);
app.use("/api/ticket", routerTicket);

app.use((req, res) => {
  let clientIp = req.headers['x-forwarded-for'];

  res.status(404).json({
    message: "Welcome to the Support Panel Server! But this route - not found!",
    clientIp: clientIp,
  });

  console.log(`Client with IP ${clientIp} tried to access a non-existent route.`);
});


app.use(errorHandler);

mongoose
  .connect(configServer.db_connect_string)
  .then(async () => {
    console.log("MongoDB connected successfully");
    start();
    server.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
  },
  serveClient: false,
});

// Middleware для проверки токена
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
  
    try {
      const decoded = jwt.verify(token, secureConfig.tokenSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error('Error decoding token:', err);
      return next(new Error('Authentication error: Invalid token'));
    }
  });
  

// // Middleware для проверки роли
// io.use((socket, next) => {
//   if (socket.handshake.query.handler === 'user') {
//     if (socket.user && socket.user.role === 'admin') {
//       console.log()
//       next();
//     } else {
//       next(new Error('Authorization error: Admin role required'));
//     }
//   } else {
//     next();
//   }
// });

io.on("connection", (socket) => {
  onConnection(io, socket);
});
