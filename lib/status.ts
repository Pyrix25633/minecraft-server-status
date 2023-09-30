import { ExecException } from "child_process";
import { sockets } from "./socket";
import { df, ipv6, ls, ps, statusFullQuery, statusTps, top } from "./commands";
import { settings } from "./settings";
import { FullQueryResponse } from "minecraft-server-util";
import path from "path";

export let cachedServices = {noipDuc: false, hamachi: false, minecraftServer: false, backupUtility: false};
export let runningServer: string | null = null;
export const cachedResourcesArray: {cpu: number, ram: number, swap: number}[] = [];
export let cachedBackups: {name: string, size: string}[] = [];
export let cachedMods: {name: string, size: string}[] = [];
export let cachedDrives = {system: 0, server: 0};
export let cachedIPv6 = 'Unknown';
export let cachedMinecraft: {version: string, motd: string, players: {online: number, max: number, list: string[]}, world: string}
    = {version: 'Unknown', motd: 'Unknown', players: {online: 0, max: 0, list: []}, world: 'Unknown'};
export let cachedMinecraftTps = 0;

for(let i = 0; i < 11; i++) {
    cachedResourcesArray.push({cpu: 0, ram: 0, swap: 0});
}

export function initializeStatus(): void {
    sendServices();
    sendResources();
    sendBackups();
    sendMods();
    sendDrives();
    sendIPv6();
    sendMinecraft();
    sendMinecraftTps();
}

function sendServices(): void {
    setTimeout(sendServices, 6000);
    ps((error: ExecException | null, stdout: string): void => {
        if(!error) {
            const expr = /(\d{1,4},\d) (?:id|total|used)/gm;
            const dataArray: number[] = [];
            for(let match = expr.exec(stdout); match != null; match = expr.exec(stdout))
                dataArray.push(parseFloat(match[0]));
            cachedServices.noipDuc = stdout.includes('noip-duc');
            cachedServices.hamachi = stdout.includes('haguichi');
            const match = /(fabric|quilt|forge)/m.exec(stdout);
            if(match != null) {
                cachedServices.minecraftServer = true;
                runningServer = match[0];
            }
            else {
                cachedServices.minecraftServer = false;
                runningServer = null;
            }
            cachedServices.backupUtility = stdout.includes('backup-utility');
            for(const socket of sockets)
                socket.emit('services', cachedServices);
        }
    });
}

function sendResources(): void {
    setTimeout(sendResources, 6000);
    top((error: ExecException | null, stdout: string): void => {
        if(!error) {
            const expr = /(\d{1,4},\d) (?:id|total|used)/gm;
            const dataArray: number[] = [];
            for(let match = expr.exec(stdout); match != null; match = expr.exec(stdout))
                dataArray.push(parseFloat(match[0]));
            const data = {
                cpu: 100 - dataArray[0],
                ram: 100 * (dataArray[2] / dataArray[1]),
                swap: 100 * (dataArray[4] / dataArray[3])
            };
            cachedResourcesArray.push(data);
            cachedResourcesArray.splice(0, 1);
            for(const socket of sockets)
                socket.emit('resources', data);
        }
    });
}

function sendBackups(): void {
    setTimeout(sendBackups, 40000);
    ls(settings.minecraft.paths.backups, (error: ExecException | null, stdout: string): void => {
        if(!error) {
            cachedBackups = [];
            stdout.split('\n').forEach((line) => {
                const match = /(\d+(?:,\d)?[BKMGT]).*\d{2}:\d{2}(?: ('.*\.zip')|  ?(.*\.zip))/.exec(line);
                if(match != null) {
                    cachedBackups.push({
                        size: match[1] + 'iB',
                        name: (match[2] != undefined ? match[2] : match[3])
                    });
                }
            });
            for(const socket of sockets)
                socket.emit('backups', cachedBackups);
        }
    });
}

function sendMods(): void {
    setTimeout(sendMods, 40000);
    ls(path.join(settings.minecraft.paths.server, 'mods'), (error: ExecException | null, stdout: string): void => {
        if(!error) {
            cachedMods = [];
            stdout.split('\n').forEach((line) => {
                const match = /(\d+(?:,\d)?[BKMGT]).*\d{2}:\d{2}(?: ('.*\.jar')|  ?(.*\.jar))/.exec(line);
                if(match != null) {
                    cachedMods.push({
                        size: match[1] + 'iB',
                        name: (match[2] != undefined ? match[2] : match[3])
                    });
                }
            });
            for(const socket of sockets)
                socket.emit('mods', cachedMods);
        }
    });
}

function sendDrives(): void {
    setTimeout(sendDrives, 40000);
    df((error: ExecException | null, stdout: string): void => {
        if(!error) {
            const match = /(\d{1,3})%.*\n.* (\d{1,3})%/m.exec(stdout);
            if(match != null) cachedDrives = {system: parseInt(match[1]), server: parseInt(match[2])};
            else cachedDrives = {system: 0, server: 0};
            for(const socket of sockets)
                socket.emit('drives', cachedDrives);
        }
    });
}

function sendIPv6(): void {
    setTimeout(sendIPv6, 40000);
    ipv6((error: ExecException | null, stdout: string): void => {
        if(!error) {
            const match = /inet6 (.+)\/64/.exec(stdout);
            if(match != null) cachedIPv6 = match[1];
            else cachedIPv6 = 'Unknown';
            for(const socket of sockets)
                socket.emit('ipv6', cachedIPv6);
        }
    });
}

function sendMinecraft(): void {
    setTimeout(sendMinecraft, 40000);
    statusFullQuery((res: FullQueryResponse): void => {
        cachedMinecraft = {
            version: res.version,
            motd: res.motd.html,
            players: res.players,
            world: res.map
        };
        for(const socket of sockets)
            socket.emit('minecraft', cachedMinecraft);
    }, () => {
        cachedMinecraft = {
            version: 'Unknown',
            motd: 'Unknown',
            players: {online: 0, max: 0, list: []},
            world: 'Unknown'
        };
        for(const socket of sockets)
            socket.emit('minecraft', cachedMinecraft);
    });
}

async function sendMinecraftTps(): Promise<void> {
    setTimeout(sendMinecraftTps, 6000);
    if(runningServer == null)
        cachedMinecraftTps = 0;
    else {
        const output = await statusTps(runningServer);
        if(output == undefined) {
            cachedMinecraftTps = 0;
        }
        else {
            if(runningServer == 'forge') {

            }
            else {
                const match = /(\d+\.\d+)/.exec(output);
                if(match != null) cachedMinecraftTps = parseFloat(match[1]);
                else cachedMinecraftTps = 0;
            }
        }
    }
    for(const socket of sockets)
        socket.emit('minecraft-tps', cachedMinecraftTps);
}