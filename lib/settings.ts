import * as fs from 'fs';
import path from 'path';

export const settings: {
    https: {
        cert: string,
        key: string,
        passphrase: string,
        port: number,
        upgradePort: number
    },
    minecraft: {
        ip: string,
        rcon: {
            port: number,
            password: string
        },
        paths: {
            backups: string,
            server: string
        }
    },
    drives: {
        server: string,
        backups: string
    }
} = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../settings/settings.json')).toString());