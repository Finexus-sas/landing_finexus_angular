var fs = require('fs');
//var users = require('./api/controllers/user')
var options = {
  key: fs.readFileSync('/home/ubuntu/CertificadoPro/server.key', 'utf8'),
  cert: fs.readFileSync('/home/ubuntu/CertificadoPro/apache/60a778ae84a9d092.crt', 'utf8')
};
var express = require("express");
var app = express();
var http = require("https").createServer(options, app);
var io = require("socket.io")(http);
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var usersConnecteds = {};


app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: "true",
  })
);
app.use(bodyParser.json());
app.use(cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(express.static("dist/simulator-credit"));

//app.use('/users', users)
app.get("*", function (req, res) {
  res.sendfile("./dist/simulator-credit/index.html");
});

io.on("connection", (socket) => {
  usersConnecteds[socket.id] = socket;

  socket.on("setSize", (data) => {
    console.log(data)
    try {
      usersConnecteds[data.id].emit("setSize", data.height);
    } catch (err) {
      console.log(err)
    }
  });

  socket.on("scrollTop", (data) => {
    try {
      usersConnecteds[data.id].emit("scrollTop", null);
    } catch (err) {
      console.log(err)
    }

  });

  socket.on("disconnect", function () {
    try {
      delete usersConnecteds[socket.id];
    } catch (err) {
      console.log(err)
    }

  });
});

http.listen(5002, () => {
  console.log("listening on *:5002");
});
