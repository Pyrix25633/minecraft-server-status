import child_process, {ExecException} from 'child_process';
import * as util from 'minecraft-server-util';
const exec = child_process.exec;
const client = new util.RCON();
process.on('uncaughtException', resetClient);
process.on('unhandledRejection', resetClient);

function resetClient() {
    try {
        client.close();
    } catch(e) {console.log(e);}
}

export function ps(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ps -A -f', callback);
}

export function ls(args: string, callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ls ' + args, callback);
}

export function top(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('top -b -n 2 |grep -e Cpu -e buff -e Swap |tail -n 3', callback);
}

export function df(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('df -h |grep -e sda4 -e sdb5', callback);
}

export function ipv6(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ip addr |grep "scope global dynamic mngtmpaddr"', callback);
}

export function status(result: (res: util.JavaStatusResponse) => void, error: (err: any) => void): void {
    util.status('127.0.0.1').then((res) => {result(res)}).catch((err) => {error(err)});
}

export function statusFullQuery(result: (res: util.FullQueryResponse) => void, error: (err: any) => void): void {
    util.queryFull('127.0.0.1').then((res) => {result(res)}).catch((err) => {error(err)});
}

export async function statusTps(): Promise<string> {
    if(!client.isConnected) try {await client.connect('127.0.0.1');} catch(_) {return undefined;}
    if(!client.isLoggedIn) try {await client.login('PyrixJmPlayz@RCON');} catch(_) {return undefined;}
    return (async () => {
        try {
            const message = await client.execute('forge tps');
            client.removeAllListeners();
            return message;
        } catch(e) {
            return undefined;
        }
    })();
}