const exec = require('child_process').exec;

export function ps(callback: Function) {
    exec('ps -A -f', callback);
}

export function ls(path: String, callback: Function) {
    exec('ls ' + path, callback);
}

export function top(callback: Function) {
    exec("top -b -n 2 |grep -e Cpu -e buff |tail -n 2", callback);
}