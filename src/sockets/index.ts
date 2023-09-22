import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class Socket {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null =
    null;

  constructor() {}

  connect(server: any) {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.io = io;
  }
}

export const websocket = new Socket();
