const statusServerImg = document.getElementById('status-server');
const noipDucImg = document.getElementById('noip-duc');
const hamachiImg = document.getElementById('hamachi');
const minecraftServerImg = document.getElementById('minecraft-server');
const backupUtilityImg = document.getElementById('backup-utility');
const cpuCanvas = document.getElementById('cpu');
const ramSwapCanvas = document.getElementById('ram-swap');
const backupsDiv = document.getElementById('backups');
const modsDiv = document.getElementById('mods');
const serverDriveDiv = document.getElementById('server-drive');
const backupsDriveDiv = document.getElementById('backups-drive');
const ipDiv = document.getElementById('ip');
const mcIconImg = document.getElementById('mc-icon');
const versionSpan = document.getElementById('version');
const motdSpan = document.getElementById('motd')
const playersOnlineSpan = document.getElementById('players-online');
const playersMaxSpan = document.getElementById('players-max');
const playersDiv = document.getElementById('players');
const worldSpan = document.getElementById('world');
const seedSpan = document.getElementById('seed');
const tpsCanvas = document.getElementById('tps');
const msptCanvas = document.getElementById('mspt');

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
                suggestedMax: 100
            }
        }
    }
};
const tpsSettings = {
    type: 'line',
    data: {
        labels: ['1m', '54s', '48s', '42s', '36s', '30s', '24s', '18s', '12s', '6s', 'now']
    },
    options: {
        scales: {
            y: {
                suggestedMin: 18,
                suggestedMax: 20
            }
        },
        plugins: {
            title: {display: true, text: 'Ticks Per Second'},
            legend: {display: false}
        },
        maintainAspectRatio: false
    }
};
const msptSettings = {
    type: 'line',
    data: {
        labels: ['1m', '54s', '48s', '42s', '36s', '30s', '24s', '18s', '12s', '6s', 'now']
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 15
            }
        },
        plugins: {
            title: {display: true, text: 'MilliSeconds Per Tick'},
            legend: {display: false}
        },
        maintainAspectRatio: false
    }
};
const datasetSettings = {
    borderWidth: 1,
    pointStyle: false,
    tension: 0.3
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
const tpsChart = new Chart(tpsCanvas, tpsSettings);
const msptChart = new Chart(msptCanvas, msptSettings);

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
socket.on('drives', (data) => {
    serverDriveDiv.style.width = data.server * 3 + 'px';
    backupsDriveDiv.style.width = data.backups * 3 + 'px';
});
socket.on('ip', (data) => {
    ipDiv.innerText = data;
});
socket.on('minecraft', (data) => {
    versionSpan.innerText = data.version;
    motdSpan.innerHTML = data.motd;
    if(data.version != 'Unknown')
        // To prevent caching: add query parameter that is always different
        mcIconImg.src = '/mc-icon?time=' + (new Date().toLocaleString('az-en').replace(', ', '-'));
    else
        mcIconImg.src = '/img/mc-icon.svg';
    playersOnlineSpan.innerText = data.players.online;
    playersMaxSpan.innerText = data.players.max;
    playersDiv.innerHTML = '';
    for(const player of data.players.list) {
        const playerDiv = document.createElement('div');
        playerDiv.classList = 'player';
        playerDiv.innerText = player;
        playersDiv.appendChild(playerDiv);
    }
    if(data.players.list.length == 0) playersDiv.style.display = 'none';
    else playersDiv.style.display = '';
    worldSpan.innerText = data.world;
    if(data.version != 'Unknown')
        seedSpan.innerHTML = '<a href="https://mcseedmap.net/' + data.version + '-Java/' + data.seed + '" target="_blank">' + data.seed + '</a>';
    else
        seedSpan.innerHTML = data.seed;
});
socket.on('minecraft-tps-mspt-old', (data) => {
    tpsChart.data.datasets = [];
    msptChart.data.datasets = [];
    for(const key of Object.keys(data.tps)) {
        const tpsDataset = JSON.parse(JSON.stringify(datasetSettings));
        const msptDataset = JSON.parse(JSON.stringify(datasetSettings));
        tpsDataset.label = key;
        msptDataset.label = key;
        tpsDataset.data = data.tps[key];
        msptDataset.data = data.mspt[key];
        tpsDataset.borderColor = key == 'Overall' ? '#DDDDDD' :
            key == 'minecraft:overworld' ? '#70B046' :
            key == 'minecraft:the_nether' ? '#854242' :
            key == 'minecraft:the_end' ? '#D5DA94' : '#68BBE3';
        msptDataset.borderColor = tpsDataset.borderColor;
        tpsChart.data.datasets.push(tpsDataset);
        msptChart.data.datasets.push(msptDataset);
    }
    tpsChart.update('none');
    msptChart.update('none');
});
socket.on('minecraft-tps-mspt', (data) => {
    for(const dataset of tpsChart.data.datasets) {
        dataset.data.push(data.tps[dataset.label]);
        dataset.data.splice(0, 1);
    }
    for(const dataset of msptChart.data.datasets) {
        dataset.data.push(data.mspt[dataset.label]);
        dataset.data.splice(0, 1);
    }
    tpsChart.update('none');
    msptChart.update('none');
});