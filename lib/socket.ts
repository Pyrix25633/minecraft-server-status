import { Socket } from "socket.io";
import { cachedServices } from "./status";

export const sockets: Socket[] = [];

export function onConnect(socket: Socket): void {
    socket.emit('services', cachedServices);
    sockets.push(socket);
    socket.on('disconnect', () => {
        sockets.splice(sockets.indexOf(socket), 1);
    });
}