const exec = require('child_process').exec;

export function ps(callback: Function) {
    exec('ps -A -f', callback);
}

export function ls(args: String, callback: Function) {
    exec('ls ' + args, callback);
}

export function top(callback: Function) {
    exec('top -b -n 2 |grep -e Cpu -e buff |tail -n 2', callback);
}

export function df(callback: Function) {
    exec('df -h |grep -e sda4 -e sdb5', callback);
}