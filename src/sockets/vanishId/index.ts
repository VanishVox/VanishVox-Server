import { websocket } from "..";
import { client } from "../../services/redis";

export const registerVanishIdSocket = () => {
  websocket.io?.of("/vanishId").on("connection", (socket) => {
    socket.on("change", async (vanishId: number) => {
      console.log({ vanishId, puid: socket.handshake.auth.puid });
      const data = await client.get(socket.handshake.auth.puid || "");
      if (data) {
        await client.del(data);
      }
      await Promise.all([
        client.set(socket.handshake.auth.puid, vanishId.toString(), {
          EX: 60,
        }),
        client.set(vanishId.toString(), socket.handshake.auth.puid, {
          EX: 60,
        }),
      ]);
    });
  });
};
