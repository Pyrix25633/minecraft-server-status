import { Socket } from "socket.io";
import { cachedBackups, cachedDrives, cachedIP, cachedMinecraft, cachedMinecraftMspt, cachedMinecraftTps, cachedMods, cachedResourcesArray, cachedServices } from "./status";

export const sockets: Socket[] = [];

export function onConnect(socket: Socket): void {
    socket.emit('services', cachedServices);
    socket.emit('resources-old', cachedResourcesArray);
    socket.emit('backups', cachedBackups);
    socket.emit('mods', cachedMods);
    socket.emit('drives', cachedDrives);
    socket.emit('ip', cachedIP);
    socket.emit('minecraft', cachedMinecraft);
    socket.emit('minecraft-tps-mspt-old', {tps: cachedMinecraftTps, mspt: cachedMinecraftMspt});
    sockets.push(socket);
    socket.on('disconnect', () => {
        sockets.splice(sockets.indexOf(socket), 1);
    });
}