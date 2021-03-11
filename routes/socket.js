//:::MENSAJES QUE VAN DESDE EL SERVIDOR AL NAVEGADOR(VISTA)
const { io } = require("../server");

io.on("connection", function (socket) {
  console.log("Usuario conectado");
  socket.on("disconnect", function (datos) {
    console.log("Usuario Desconectado");
  });
});

io.on("connection", function (socket) {
  socket.on("enviar_mensaje", function (datos) {
    socket.broadcast.emit("respuesta", datos);
    console.log(datos);
  });
});
