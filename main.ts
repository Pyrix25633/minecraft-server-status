import express, {Express, Request, Response} from 'express';
import {ExecException} from 'child_process';
import {ls, ps, df, top} from './commands';

const main: Express = express();
const port: number = 4000;

main.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

main.get('/', (req: Request, res: Response) => {
  res.sendFile('./pages/index.html', {root: __dirname});
});

main.get('/css/style.css', (req: Request, res: Response) => {
  res.sendFile('./pages/css/style.css', {root: __dirname});
});

main.get('/js/script.js', (req: Request, res: Response) => {
  res.sendFile('./pages/js/script.js', {root: __dirname});
});

main.get('/img/icon.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/icon.svg', {root: __dirname});
});
main.get('/img/refresh.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/refresh.svg', {root: __dirname});
});
main.get('/img/on.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/on.svg', {root: __dirname});
});
main.get('/img/off.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/off.svg', {root: __dirname});
});
main.get('/img/services.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/services.svg', {root: __dirname});
});
main.get('/img/resources.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/resources.svg', {root: __dirname});
});
main.get('/img/backups.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/backups.svg', {root: __dirname});
});
main.get('/img/drives.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/drives.svg', {root: __dirname});
});
main.get('/img/mods.svg', (req: Request, res: Response) => {
  res.sendFile('./pages/img/mods.svg', {root: __dirname});
});

main.get('/services', (req: Request, res: Response) => {
  let data = {hamachi: 'off', minecraftServer: 'off', backupUtility: 'off'};
  ps((error: ExecException | null, stdout: string, stderr: string) => {
    if(error) {
      res.sendStatus(404);
      return;
    }
    if(stdout.includes('haguichi'))
      data.hamachi = 'on';
    if(stdout.includes('minecraftforge'))
      data.minecraftServer = 'on';
    if(stdout.includes('backup-utility'))
      data.backupUtility = 'on';
    res.send(data);
  });
});

main.get('/resources', (req: Request, res: Response) => {
  let data = {cpu: 0, ram: 0};
  top((error: ExecException | null, stdout: string, stderr: string) => {
    let arr = [];
    stdout.split(' ').forEach((element) => {
      if(element != '')
        arr = arr.concat(element);
    });
    data.cpu = parseInt((parseFloat(arr[1]) + parseFloat(arr[3])).toFixed(0));
    data.ram = parseInt((parseFloat(arr[23]) / parseFloat(arr[19]) * 100).toFixed(0));
    res.send(data);
  })
});

main.get('/backups', (req: Request, res: Response) => {
  let data = {backups: []};
  ls('-l -h /media/admin25633/Drive/server-forge/PyrixJmPlayz-backup-backups/',
    (error: ExecException | null, stdout: string, stderr: string) => {
    if(error) {
      res.sendStatus(404);
      return;
    }
    stdout.split('\n').forEach((element) => {
      if(element.includes('.zip')) {
        let arr = [];
        element.split(' ').forEach((e) => {
          if(e != '') arr = arr.concat(e);
        });
        data.backups = data.backups.concat({name: arr[8].substring(0, arr[8].length - 4), size: arr[4] + 'iB'});
      }
    });
    data.backups.reverse();
    res.send(data);
  });
});

main.get('/drives', (req: Request, res: Response) => {
  let data = {system: 0, server: 0};
  df((error: ExecException | null, stdout: string, stderr: string) => {
    if(error) {
      res.sendStatus(404);
      return;
    }
    let arr = [];
    stdout.split('\n').forEach((element) => {
      element.split(' ').forEach((e) => {
        if(e != '') arr = arr.concat(e);
      });
    });
    data.system = parseInt(arr[4].substring(0, arr[4].length - 1));
    data.server = parseInt(arr[10].substring(0, arr[10].length - 1));
    res.send(data);
  });
});

main.get('/mods', (req: Request, res: Response) => {
  let data = {mods: []};
  ls('/media/admin25633/Drive/server-forge/mods/', (error: ExecException | null, stdout: string, stderr: string) => {
    if(error) {
      res.sendStatus(404);
      return;
    }
    stdout.split('\n').forEach((element) => {
      if(element.includes('.jar')) {
        data.mods = data.mods.concat(element.substring(0, element.length - 4));
      }
    });
    res.send(data);
  });
});