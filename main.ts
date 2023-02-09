const express = require('express');
const bodyParser = require('body-parser');
const currentProcesses = require('current-processes');
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

main.get('/services', (req, res) => {
  let data = {hamachi:'off', minecraftServer: 'off', backupUtility: 'off'};
  currentProcesses.get((err, processes) => {
    for(let i = 0; i < processes.length; i++) {
      let name = processes[i]['name'];
      if(name == 'haguichi') {
        data.hamachi = 'on';
      }
      else if(name.includes('java')) {
        data.minecraftServer = 'on';
      }
      else if(name == 'backup-utility') {
        data.backupUtility = 'on';
      }
    }
    res.send(data);
  });  
});