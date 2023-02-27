import child_process, {ExecException} from 'child_process';
const exec = child_process.exec;

export function ps(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ps -A -f', callback);
}

export function ls(args: string, callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ls ' + args, callback);
}

export function top(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('top -b -n 2 |grep -e Cpu -e buff |tail -n 2', callback);
}

export function df(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('df -h |grep -e sda4 -e sdb5', callback);
}

export function ipv6(callback: (error: ExecException | null, stdout: string, stderr: string) => void): void {
    exec('ip addr |grep "scope global dynamic mngtmpaddr"', callback);
}