import EventEmitter from "events";
import { websocket } from "..";
import { client } from "../../services/redis";

const acceptAddContactEvent = new EventEmitter();
acceptAddContactEvent.setMaxListeners(Infinity);

export const registerContactsSocket = () => {
  websocket.io?.of("/contacts").on("connection", (socket) => {
    socket.join(socket.handshake.auth.puid);

    socket.on("add", async (vanishId: string) => {
      const [puid, currentUserVanishId] = await Promise.all([
        await client.get(vanishId),
        await client.get(socket.handshake.auth.puid),
      ]);

      if (puid && currentUserVanishId) {
        socket.join(puid);
        socket.broadcast.emit("added", { puid, vanishId: currentUserVanishId });
      }
    });
    socket.on("added", async (puid: string, accept: boolean) => {
      socket.broadcast.emit("add:receiver", accept ? puid : null);
      const sockets = await socket.broadcast.fetchSockets();
      // sockets.forEach((sock) => {
      //   if (sock.handshake.auth.puid !== socket.handshake.auth.puid) {
      socket.emit("add:sender", sockets[0].handshake.auth.puid);
      //   }
      // });
      socket.leave(puid);
    });
  });
};
