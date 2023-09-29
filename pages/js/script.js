const statusServerImg = document.getElementById('status-server');
const noipDucImg = document.getElementById('noip-duc');
const hamachiImg = document.getElementById('hamachi');
const minecraftServerImg = document.getElementById('minecraft-server');
const backupUtilityImg = document.getElementById('backup-utility');
const cpuCanvas = document.getElementById('cpu');
const ramSwapCanvas = document.getElementById('ram-swap');
const backupsDiv = document.getElementById('backups');
const modsDiv = document.getElementById('mods');
const ipv6Div = document.getElementById('ipv6');
const systemDiv = document.getElementById('system');
const serverDiv = document.getElementById('server');
const versionSpan = document.getElementById('version');
const motdSpan = document.getElementById('motd')
const playersOnlineSpan = document.getElementById('players-online');
const playersMaxSpan = document.getElementById('players-max');
const playersDiv = document.getElementById('players');
const worldSpan = document.getElementById('world');
const faviconImg = document.getElementById('favicon');

Chart.defaults.backgroundColor = '#222222';
Chart.defaults.borderColor = '#333333';
Chart.defaults.color = '#DDDDDD';
Chart.defaults.font.family = "'Roboto Mono', monospace";
const percentageSettings = {
    type: 'line',
    data: {
        labels: ['1m', '54s', '48s', '42s', '36s', '30s', '24s', '18s', '12s', '6s', 'now']
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
};
const datasetSettings = {
    borderWidth: 1,
    pointStyle: false,
    tension: 0.3,
};
const cpuSettings = JSON.parse(JSON.stringify(percentageSettings));
const cpuDatasetSettings = JSON.parse(JSON.stringify(datasetSettings));
cpuDatasetSettings.label = 'CPU',
cpuDatasetSettings.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
cpuDatasetSettings.borderColor = '#DDDDDD';
cpuSettings.data.datasets = [cpuDatasetSettings];
const ramSwapSettings = JSON.parse(JSON.stringify(percentageSettings));
const ramDatasetSettings = JSON.parse(JSON.stringify(datasetSettings));
ramDatasetSettings.label = 'RAM',
ramDatasetSettings.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
ramDatasetSettings.borderColor = '#DDDDDD';
const swapDatasetSettings = JSON.parse(JSON.stringify(datasetSettings));
swapDatasetSettings.label = 'SWAP',
swapDatasetSettings.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
swapDatasetSettings.borderColor = '#68BBE3';
ramSwapSettings.data.datasets = [ramDatasetSettings, swapDatasetSettings];

const cpuChart = new Chart(cpuCanvas, cpuSettings);
const ramSwapChart = new Chart(ramSwapCanvas, ramSwapSettings);

const socket = io();
socket.on('connect', () => {
    statusServerImg.src = './img/online.svg'
});
socket.on('disconnect', () => {
    statusServerImg.src = './img/offline.svg'
});
socket.on('services', (data) => {
    noipDucImg.src = './img/' + (data.noipDuc ? 'on' : 'off') + '.svg'
    hamachiImg.src = './img/' + (data.hamachi ? 'on' : 'off') + '.svg'
    minecraftServerImg.src = './img/' + (data.minecraftServer ? 'on' : 'off') + '.svg'
    backupUtilityImg.src = './img/' + (data.backupUtility ? 'on' : 'off') + '.svg'
});
socket.on('resources-old', (data) => {
    for(const resources of data) {
        cpuChart.data.datasets[0].data.push(resources.cpu);
        cpuChart.data.datasets[0].data.splice(0, 1);
        ramSwapChart.data.datasets[0].data.push(resources.ram);
        ramSwapChart.data.datasets[0].data.splice(0, 1);
        ramSwapChart.data.datasets[1].data.push(resources.swap);
        ramSwapChart.data.datasets[1].data.splice(0, 1);
    }
    cpuChart.update('none');
    ramSwapChart.update('none');
});
socket.on('resources', (data) => {
    cpuChart.data.datasets[0].data.push(data.cpu);
    cpuChart.data.datasets[0].data.splice(0, 1);
    ramSwapChart.data.datasets[0].data.push(data.ram);
    ramSwapChart.data.datasets[0].data.splice(0, 1);
    ramSwapChart.data.datasets[1].data.push(data.swap);
    ramSwapChart.data.datasets[1].data.splice(0, 1);
    cpuChart.update('none');
    ramSwapChart.update('none');
});
socket.on('backups', (data) => {
    backupsDiv.innerHTML = '';
    for(const backup of data) {
        const backupDiv = document.createElement('div');
        backupDiv.classList = 'backup';
        const nameSpan = document.createElement('span');
        const nameA = document.createElement('a');
        nameA.href = '/backups/' + backup.name.replace("'", '').replace(' ', '%20');
        const sizeSpan = document.createElement('span');
        nameSpan.innerText = backup.name;
        sizeSpan.innerText = backup.size;
        nameA.appendChild(nameSpan);
        backupDiv.appendChild(nameA);
        backupDiv.appendChild(sizeSpan);
        backupsDiv.appendChild(backupDiv);
    }
    if(data.length == 0) backupsDiv.style.display = 'none';
    else backupsDiv.style.display = '';
});
socket.on('mods', (data) => {
    modsDiv.innerHTML = '';
    for(const mod of data) {
        const modDiv = document.createElement('div');
        modDiv.classList = 'mod';
        const nameSpan = document.createElement('span');
        const nameA = document.createElement('a');
        nameA.href = '/mods/' + mod.name.replace("'", '').replace(' ', '%20');
        const sizeSpan = document.createElement('span');
        nameSpan.innerText = mod.name;
        sizeSpan.innerText = mod.size;
        nameA.appendChild(nameSpan);
        modDiv.appendChild(nameA);
        modDiv.appendChild(sizeSpan);
        modsDiv.appendChild(modDiv);
    }
    if(data.length == 0) modsDiv.style.display = 'none';
    else modsDiv.style.display = '';
});
socket.on('ipv6', (data) => {
    ipv6Div.innerText = data;
});
socket.on('drives', (data) => {
    systemDiv.style.width = data.system * 3 + 'px';
    serverDiv.style.width = data.server * 3 + 'px';
});

/*
function requestStatus(args = '') {
  $.ajax({
    url: '/status' + args,
    method: 'GET',
    dataType: 'json',
    success: setStatus,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestStatusFullQuery(args = '') {
  $.ajax({
    url: '/statusFullQuery' + args,
    method: 'GET',
    dataType: 'json',
    success: setStatusFullQuery,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestStatusTps(args = '') {
  $.ajax({
    url: '/statusTps' + args,
    method: 'GET',
    dataType: 'json',
    success: setStatusTps,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function setStatus(data) {
  versionSpan.innerText = data.version;
  motdSpan.innerHTML = data.motd;
  faviconImg.src = data.favicon;
}

function setStatusFullQuery(data) {
  playersOnlineSpan.innerText = data.players.online;
  playersMaxSpan.innerText = data.players.max;
  let players = data.players.list;
  playersDiv.innerHTML = '';
  for(let i = 0; i < players.length; i++) {
    let player = document.createElement('div');
    player.classList = 'player';
    player.innerText = players[i];
    playersDiv.appendChild(player);
  }
  worldSpan.innerText = data.world;
}

function setStatusTps(data) {
  shiftArray(tpsOverworldGraph);
  shiftArray(tpsNetherGraph);
  shiftArray(tpsEndGraph);
  tpsOverworldGraph[9] = data.overworld / 20 * 100;
  tpsNetherGraph[9] = data.nether / 20 * 100;
  tpsEndGraph[9] = data.end / 20 * 100;
  let tpsOverworldDivs = tpsOverworldDiv.getElementsByTagName('div');
  let tpsNetherDivs = tpsNetherDiv.getElementsByTagName('div');
  let tpsEndDivs = tpsEndDiv.getElementsByTagName('div');
  tpsOverworldNowSpan.innerText = data.overworld;
  for(let i = 0; i < tpsOverworldDivs.length; i++)
    tpsOverworldDivs[i].style.height = tpsOverworldGraph[i] + 'px';
  tpsNetherNowSpan.innerText = data.nether;
  for(let i = 0; i < tpsNetherDivs.length; i++)
    tpsNetherDivs[i].style.height = tpsNetherGraph[i] + 'px';
  tpsEndNowSpan.innerText = data.end;
  for(let i = 0; i < tpsEndDivs.length; i++)
    tpsEndDivs[i].style.height = tpsEndGraph[i] + 'px';
}

function shiftArray(array) {
  for(let i = 1; i < array.length; i++)
    array[i - 1] = array[i];
}*/