import { Socket } from "socket.io";
import { cachedBackups, cachedDrives, cachedIPv6, cachedMinecraft, cachedMinecraftTps, cachedMods, cachedResourcesArray, cachedServices } from "./status";

export const sockets: Socket[] = [];

export function onConnect(socket: Socket): void {
    socket.emit('services', cachedServices);
    socket.emit('resources-old', cachedResourcesArray);
    socket.emit('backups', cachedBackups);
    socket.emit('mods', cachedMods);
    socket.emit('drives', cachedDrives);
    socket.emit('ipv6', cachedIPv6);
    socket.emit('minecraft', cachedMinecraft);
    socket.emit('minecraft-tps', cachedMinecraftTps);
    sockets.push(socket);
    socket.on('disconnect', () => {
        sockets.splice(sockets.indexOf(socket), 1);
    });
}