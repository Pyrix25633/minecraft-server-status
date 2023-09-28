import express, { Express, Request, Response } from 'express';
import { ExecException } from 'child_process';
import { ls, ps, df, top, ipv6, status, statusFullQuery, statusTps } from './lib/commands';
import { FullQueryResponse, JavaStatusResponse } from 'minecraft-server-util';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https';
import cors from 'cors';
import helmet from 'helmet';
import { settings } from './lib/settings';
import path from 'path';
import { Server } from 'socket.io';
import { onConnect } from './lib/socket';
import { initializeStatus } from './lib/status';

const main: Express = express();
const port: number = settings.https.port;

let buffer: {
  services: {data: {noipDuc: string, hamachi: string, minecraftServer: string, backupUtility: string}, timestamp: number},
  resources: {data: {cpu: number, ram: number, swap: number}, timestamp: number},
  backups: {data: {backups: {name: string, size: string}[]}, timestamp: number},
  ipv6: {data: {ipv6: string}, timestamp: number},
  drives: {data: {system: number, server: number}, timestamp: number},
  status: {data: {version: string, motd: string, favicon: string | null}, timestamp: number},
  statusFullQuery: {data: {players: {online: number, max: number, list: string[]}, world: string}, timestamp: number},
  statusTps: {data: {overworld: number, nether: number, end: number}, timestamp: number}
} = {
  services: {data: {noipDuc: 'off', hamachi: 'off', minecraftServer: 'off', backupUtility: 'off'}, timestamp: 0},
  resources: {data: {cpu: 0, ram: 0, swap: 0}, timestamp: 0},
  backups: {data: {backups: []}, timestamp: 0},
  ipv6: {data: {ipv6: "::"}, timestamp: 0},
  drives: {data: {system: 0, server: 0}, timestamp: 0},
  status: {data: {version: 'Unknown', motd: 'Unknown', favicon: './img/favicon.svg'}, timestamp: 0},
  statusFullQuery: {data: {players: {online: 0, max: 0, list: []}, world: 'Unknown'}, timestamp: 0},
  statusTps: {data: {overworld: 0, nether: 0, end: 0}, timestamp: 0}
};
let timeout = {
  sixSeconds: 6000 * 95 / 100,
  fourtySeconds: 4000 * 95 / 100
};

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

main.get('/services', (req: Request, res: Response) => {
  let data = buffer.services.data;
  let timestamp: number = Date.now();
  if(buffer.services.timestamp + timeout.sixSeconds < timestamp || req.query.force == 'true') {
    ps((error: ExecException | null, stdout: string, stderr: string) => {
      if(error) {
        res.sendStatus(404);
        return;
      }
      buffer.services.data = {noipDuc: 'off', hamachi: 'off', minecraftServer: 'off', backupUtility: 'off'};
      if(stdout.includes('noip-duc'))
        data.noipDuc = 'on';
      if(stdout.includes('haguichi'))
        data.hamachi = 'on';
      if(stdout.includes('minecraftforge'))
        data.minecraftServer = 'on';
      if(stdout.includes('backup-utility'))
        data.backupUtility = 'on';
      buffer.services.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

main.get('/resources', (req: Request, res: Response) => {
  let data = buffer.resources.data;
  let timestamp: number = Date.now();
  if(buffer.resources.timestamp + timeout.sixSeconds < timestamp || req.query.force == 'true') {
    top((error: ExecException | null, stdout: string, stderr: string) => {
      let arr: string[] = [];
      stdout.split(' ').forEach((element) => {
        if(element != '')
          arr = arr.concat(element);
      });
      data.cpu = parseInt((parseFloat(arr[1]) + parseFloat(arr[3])).toFixed(0));
      data.ram = parseInt((parseFloat(arr[23]) / parseFloat(arr[19]) * 100).toFixed(0));
      data.swap = parseInt((parseFloat(arr[32]) / parseFloat(arr[28]) * 100).toFixed(0));
      buffer.resources.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

main.get('/backups', (req: Request, res: Response) => {
  let data = buffer.backups.data;
  let timestamp: number = Date.now();
  if(buffer.backups.timestamp + timeout.fourtySeconds < timestamp || req.query.force == 'true') {
    ls('-l -h /media/admin25633/Drive/server-forge/PyrixJmPlayz-backup-backups/',
      (error: ExecException | null, stdout: string, stderr: string) => {
      if(error) {
        res.sendStatus(404);
        return;
      }
      data = buffer.backups.data = {backups: []};
      stdout.split('\n').forEach((element) => {
        if(element.includes('.zip')) {
          let arr: string[] = [];
          element.split(' ').forEach((e) => {
            if(e != '') arr = arr.concat(e);
          });
          data.backups = data.backups.concat({name: arr[8].substring(0, arr[8].length - 4), size: arr[4] + 'iB'});
        }
      });
      data.backups.reverse();
      buffer.backups.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

main.get('/ipv6', (req: Request, res: Response) => {
  let data = buffer.ipv6.data;
  let timestamp: number = Date.now();
  if(buffer.ipv6.timestamp + timeout.fourtySeconds < timestamp || req.query.force == 'true') {
    ipv6((error: ExecException | null, stdout: string, stderr: string) => {
      if(error) {
        res.sendStatus(404);
        return;
      }
      data.ipv6 = stdout.split(' ')[5].replace('/64', '');
      buffer.ipv6.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

main.get('/drives', (req: Request, res: Response) => {
  let data = buffer.drives.data;
  let timestamp: number = Date.now();
  if(buffer.drives.timestamp + timeout.fourtySeconds < timestamp || req.query.force == 'true') {
    df((error: ExecException | null, stdout: string, stderr: string) => {
      if(error) {
        res.sendStatus(404);
        return;
      }
      let arr: string[] = [];
      stdout.split('\n').forEach((element) => {
        element.split(' ').forEach((e) => {
          if(e != '') arr = arr.concat(e);
        });
      });
      data.system = parseInt(arr[4].substring(0, arr[4].length - 1));
      data.server = parseInt(arr[10].substring(0, arr[10].length - 1));
      buffer.drives.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

main.get('/status', (req: Request, res: Response) => {
  let data = buffer.status.data;
  let timestamp: number = Date.now();
  if(buffer.status.timestamp + timeout.fourtySeconds < timestamp || req.query.force == 'true') {
    status((result: JavaStatusResponse) => {
      data.version = result.version.name;
      data.motd = result.motd.html;
      data.favicon = result.favicon;
      buffer.status.timestamp = timestamp;
      res.send(data);
    },
    (err: any) => {
      buffer.status.data = {version: 'Unknown', motd: 'Unknown', favicon: './img/favicon.svg'};
      buffer.status.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

main.get('/statusFullQuery', (req: Request, res: Response) => {
  let data = buffer.statusFullQuery.data;
  let timestamp: number = Date.now();
  if(buffer.statusFullQuery.timestamp + timeout.sixSeconds < timestamp || req.query.force == 'true') {
    statusFullQuery((result: FullQueryResponse) => {
      data.world = result.map;
      data.players = result.players;
      buffer.statusFullQuery.timestamp = timestamp;
      res.send(data);
    },
    (err: any) => {
      buffer.statusFullQuery.data = {players: {online: 0, max: 0, list: []}, world: 'Unknown'};
      buffer.statusFullQuery.timestamp = timestamp;
      res.send(data);
    });
  }
  else res.send(data);
});

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
});