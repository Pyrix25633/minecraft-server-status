import path from 'path';
import * as fs from 'fs';

export const settings: {
    https: {
        cert: string,
        key: string,
        passphrase: string,
        port: number
    },
    minecraft: {
        ip: string,
        rcon: {
            port: number,
            password: string
        }
    }
} = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../settings/settings.json')).toString());