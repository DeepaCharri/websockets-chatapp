const ws = require("ws");

const web_socket_server = new ws.Server({ port: 8080 });
// let clients = [];
let users = []; // to store the user information
// {
//    username: "rahul",
//    socket: ws
// }

console.log("Server started on ws://localhost:8080c");
web_socket_server.on("connection", (socket) => {
  console.log("New user connected");
  clients.push(socket);

  socket.on("message", (message) => {
    console.log("Received message: " + message);

    let data = JSON.parse(message);

    if (data.type === "registred") {
      users.push({ username: data.username, socket: socket });
    }

    if (data.type === "message") {
      const targetUser = users[data.to];
      if (targetUser) {
        targetUser.send(
          JSON.stringify({ from: data.from, message: data.message })
        );
      }

      if (data.to === "all") {
        clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(
              JSON.stringify({ from: data.from, message: data.message })
            );
          }
        });
      }
    }
  });

  socket.on("close", () => {
    console.log("User disconnected");
    clients = clients.filter((client) => client !== socket);
  });
});
