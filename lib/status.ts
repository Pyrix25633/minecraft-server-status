import { ExecException, exec } from "child_process";
import { sockets } from "./socket";
import { ps } from "./commands";

export let cachedServices = {noipDuc: false, hamachi: false, minecraftServer: false, backupUtility: false};
let runningServer: string | null = null;

for(let i = 0; i < 11; i++) {
    //cachedStatusShortArray.push({cpu: 0, ram: 0, swap: 0});
}

export function initializeStatus(): void {
    sendServices();
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
            const match = /(fabric|forge)/m.exec(stdout);
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