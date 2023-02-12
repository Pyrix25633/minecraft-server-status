const express = require('express');
const bodyParser = require('body-parser');
import {ls, ps, df, top} from './commands';

const main = express();
const port: number = 4000;

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

main.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

main.get('/', (req, res) => {
  res.sendFile('./pages/index.html', {root: __dirname});
});

main.get('/css/style.css', (req, res) => {
  res.sendFile('./pages/css/style.css', {root: __dirname});
});

main.get('/js/script.js', (req, res) => {
  res.sendFile('./pages/js/script.js', {root: __dirname});
});

main.get('/img/icon.svg', (req, res) => {
  res.sendFile('./pages/img/icon.svg', {root: __dirname});
});
main.get('/img/on.svg', (req, res) => {
  res.sendFile('./pages/img/on.svg', {root: __dirname});
});
main.get('/img/off.svg', (req, res) => {
  res.sendFile('./pages/img/off.svg', {root: __dirname});
});
main.get('/img/services.svg', (req, res) => {
  res.sendFile('./pages/img/services.svg', {root: __dirname});
});
main.get('/img/resources.svg', (req, res) => {
  res.sendFile('./pages/img/resources.svg', {root: __dirname});
});
main.get('/img/backups.svg', (req, res) => {
  res.sendFile('./pages/img/backups.svg', {root: __dirname});
});
main.get('/img/drives.svg', (req, res) => {
  res.sendFile('./pages/img/drives.svg', {root: __dirname});
});
main.get('/img/mods.svg', (req, res) => {
  res.sendFile('./pages/img/mods.svg', {root: __dirname});
});

main.get('/services', (req, res) => {
  let data = {hamachi: 'off', minecraftServer: 'off', backupUtility: 'off'};
  ps((error, stdout, stderr) => {
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

main.get('/resources', (req, res) => {
  let data = {cpu: 0, ram: 0};
  top((error, stdout, stderr) => {
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

main.get('/backups', (req, res) => {
  let data = {backups: []};
  ls('-l -h /media/admin25633/Drive/server-forge/PyrixJmPlayz-backup-backups/', (error, stdout, stderr) => {
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

main.get('/drives', (req, res) => {
  let data = {system: 0, server: 0};
  df((error, stdout, stderr) => {
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

main.get('/mods', (req, res) => {
  let data = {mods: []};
  ls('/media/admin25633/Drive/server-forge/mods/', (error, stdout, stderr) => {
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