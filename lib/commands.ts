import child_process, { ExecException } from 'child_process';
import * as util from 'minecraft-server-util';
import { settings } from './settings';
const exec = child_process.exec;
const client = new util.RCON();
process.on('uncaughtException', resetClient);
process.on('unhandledRejection', resetClient);

function resetClient() {
    try {
        client.close();
    } catch(e) {console.log(e);}
}

export function ps(callback: (error: ExecException | null, stdout: string) => void): void {
    exec('ps -A -f', callback);
}

export function top(callback: (error: ExecException | null, stdout: string) => void): void {
    exec('top -b -n 2 |grep -e Cpu -e buff -e Swap |tail -n 3', callback);
}

export function ls(path: string, callback: (error: ExecException | null, stdout: string) => void): void {
    exec('ls -l -h ' + path, callback);
}

export function ip(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ip addr |grep "scope global dynamic mngtmpaddr" || ip addr |grep "scope global dynamic noprefixroute"', callback);
}

export function df(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('df -h |grep -e ' + settings.drives.server + ' -e ' + settings.drives.backups, callback);
}

export function statusFullQuery(result: (res: util.FullQueryResponse) => void, error: () => void): void {
    util.queryFull(settings.minecraft.ip).then(result).catch(error);
}

export async function statusTps(server: string): Promise<string | undefined> {
    if(!client.isConnected) try {await client.connect(settings.minecraft.ip, settings.minecraft.rcon.port);} catch(_) {return undefined;}
    if(!client.isLoggedIn) try {await client.login(settings.minecraft.rcon.password);} catch(_) {return undefined;}
    return (async () => {
        try {
            const message = await client.execute(server + ' tps');
            client.removeAllListeners();
            return message;
        } catch(e) {
            return undefined;
        }
    })();
}

export async function statusSeed(): Promise<string | undefined> {
    if(!client.isConnected) try {await client.connect(settings.minecraft.ip, settings.minecraft.rcon.port);} catch(_) {return undefined;}
    if(!client.isLoggedIn) try {await client.login(settings.minecraft.rcon.password);} catch(_) {return undefined;}
    return (async () => {
        try {
            const message = await client.execute('seed');
            client.removeAllListeners();
            return message;
        } catch(e) {
            return undefined;
        }
    })();
}