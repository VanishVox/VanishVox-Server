import { websocket } from "./sockets";
import http from "http";
import { client } from "./services/redis";
import { registerVanishIdSocket } from "./sockets/vanishId";
import { registerContactsSocket } from "./sockets/contacts";

const server = http.createServer();

(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("Cant connect to redis server");
    console.log(error);
  }

  websocket.connect(server);
  registerVanishIdSocket();
  registerContactsSocket();
})();

server.listen(process.env.PORT || 8300, () => {
  console.log(`server running on ${process.env.PORT || 8300}`);
});
