const express = require("express");
const app = express();
const helmet =require ("helmet");
const cors = require("cors");
////////////////////
require("./src/config/passport");
const passport = require("passport");
const mainRouter = require("./src/routers/main_router");
const session = require("express-session");

require("./src/config/database");

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));

app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000,
    },
  }),
    cors({
      origin: ["http://www.beehiliv.com.tr"],
      methods: ["GET", "POST"],
      credentials: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/", mainRouter);

app.listen(4000, () => {
  console.log("Server running at http://www.beehiliv.com.tr:" + 4000);

  
});
///////////////////////////////////////////////////////////////////////////////////////////
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketRouter = require("./src/routers/socket_router");
let app2 = express();
const port = 4001;
app2.use(express.json());
app2.use(express.urlencoded({ extended: true }));

app2.use(socketRouter);

app2.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "welcome to the beginning of greatness",
  });
});

const httpServer = createServer(app2);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

const logController = require('./src/controllers/logController');

io.on("connection", (socket) => {
  console.log("We are live and connected");
  console.log("connected device id: " + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected id :" + socket.id);
  });
  io.emit("some event", {
    someProperty: "some value",
    otherProperty: "other value",
  });
  
  // This will emit the event to all connected sockets
  var delay = 0;
  var delay1 = 0;
  socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
  socket.broadcast.emit('newclientconnect',{ description:  "new client connected!"})
  socket.on("message", (msg) => {
    io.emit("message", msg);
    console.log("mesaj: ");

    //her 10dk
    if((Date.now()-delay)>600000){

      logController.saveLog(msg);
      delay = Date.now();
    }

    setTimeout(() => {},5000);

    // her dakika
    if((Date.now()-delay1)>60000){
      logController.last24Hour(msg);
      delay1 = Date.now();
    }
    logController.sendSMS(msg);
  });
});

httpServer.listen(port, () => {
  console.log(`Example socket-app listening on port ${port}`);
});
