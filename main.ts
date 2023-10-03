import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https';
import cors from 'cors';
import helmet from 'helmet';
import { settings } from './lib/settings';
import path from 'path';
import { Server } from 'socket.io';
import { onConnect } from './lib/socket';
import { initializeStatus, runningServer } from './lib/status';

const main: Express = express();
const port: number = settings.https.port;

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
server.listen(port, () => {
    console.log('Server listening on port ' + port);
});

const io = new Server(server);
io.on('connect', onConnect);

initializeStatus();

/*
main.get('/statusTps', async (req: Request, res: Response) => {
  let data = buffer.statusTps.data;
  let timestamp: number = Date.now();
  if((buffer.statusTps.timestamp + timeout.sixSeconds < timestamp || req.query.force == 'true')) {
    let output = await statusTps();
    if(output != undefined) {
      let array = output.split('Mean TPS: ');
      data.overworld = parseFloat(array[1].substring(0, 6));
      data.end = parseFloat(array[2].substring(0, 6));
      data.nether = parseFloat(array[3].substring(0, 6));
    }
    else buffer.statusTps.data = {overworld: 0, nether: 0, end: 0};
    buffer.statusTps.timestamp = timestamp;
    res.send(data);
  }
  else res.send(data);
});*/