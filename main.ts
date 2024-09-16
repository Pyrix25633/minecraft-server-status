import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import path from 'path';
import { Server } from 'socket.io';
import { settings } from './lib/settings';
import { onConnect } from './lib/socket';
import { initializeStatus, runningServer } from './lib/status';

const main: Express = express();
const upgradeMain: Express = express();

main.set('trust proxy', true)
main.use(bodyParser.urlencoded({extended: true}));
main.use(bodyParser.json());
main.use(cors());
main.use(helmet());
main.use(helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
        "default-src": ["'self'"],
        "base-uri": "'self'",
        "font-src": ["'self'", "https:"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "https:"],
        "script-src-attr": "'none'",
        "style-src": ["'self'", "https:", "data:", "'unsafe-inline'"],
    }
}));
main.use('/css', express.static('./pages/css'));
main.use('/js', express.static('./pages/js'));
main.use('/img', express.static('./pages/img'));
main.use('/backups', express.static(settings.minecraft.paths.backups));
main.use('/mods', express.static(path.join(settings.minecraft.paths.server, 'mods')));

main.get('/mc-icon', (req: Request, res: Response) => {
    const file = path.join(settings.minecraft.paths.server, 'server-icon.png');
    if(runningServer == null || !fs.existsSync(file))
        res.sendFile('./pages/img/mc-icon.svg', {root: __dirname});
    else
        res.sendFile(file);
});

main.get('/', (req: Request, res: Response) => {
    res.sendFile('./pages/index.html', {root: __dirname});
});

const options = {
    key: fs.readFileSync(path.resolve(__dirname, settings.https.key)),
    cert: fs.readFileSync(path.resolve(__dirname, settings.https.cert)),
    passphrase: settings.https.passphrase
};
export const server = https.createServer(options, main);
server.listen(settings.https.port, () => {
    console.log('Server listening on port ' + settings.https.port);
});
upgradeMain.all('*', (req, res): void => {
    res.redirect(301, 'https://' + req.hostname + req.url);
});
const upgradeServer = http.createServer(upgradeMain);
upgradeServer.listen(settings.https.upgradePort, (): void => {
    console.log('Upgrade Server listening on Port ' + settings.https.upgradePort);
});

const io = new Server(server);
io.on('connect', onConnect);

initializeStatus();