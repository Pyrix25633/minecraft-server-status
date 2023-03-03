const refreshImg = document.getElementById('refresh');
const hamachiImg = document.getElementById('hamachi');
const minecraftServerImg = document.getElementById('minecraft-server');
const backupUtilityImg = document.getElementById('backup-utility');
const cpuDiv = document.getElementById('cpu');
const ramDiv = document.getElementById('ram');
const swapDiv = document.getElementById('swap');
const cpuGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const ramGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const swapGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const backupsDiv = document.getElementById('backups');
const ipv6Div = document.getElementById('ipv6');
const systemDiv = document.getElementById('system');
const serverDiv = document.getElementById('server');
const modsDiv = document.getElementById('mods');

function onLoad() {
  requestServices();
  requestResources();
  requestBackups();
  requestIpv6();
  requestDrives();
  requestMods();
  refreshImg.addEventListener('click', () => {
    requestServices();
    requestResources();
    requestBackups();
    requestDrives();
    requestMods();
  });
}

function requestServices() {
  $.ajax({
    url: '/services',
    method: 'GET',
    dataType: 'json',
    success: setServices,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestResources() {
  $.ajax({
    url: '/resources',
    method: 'GET',
    dataType: 'json',
    timeout: 4000,
    success: setResources,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestBackups() {
  $.ajax({
    url: '/backups',
    method: 'GET',
    dataType: 'json',
    success: setBackups,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestIpv6() {
  $.ajax({
    url: '/ipv6',
    method: 'GET',
    dataType: 'json',
    success: setIpv6,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestDrives() {
  $.ajax({
    url: '/drives',
    method: 'GET',
    dataType: 'json',
    success: setDrives,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestMods() {
  $.ajax({
    url: '/mods',
    method: 'GET',
    dataType: 'json',
    success: setMods,
    error: (req, err) => {
      console.log(err);
    }
  });
}

setInterval(requestServices, 6000);
setInterval(requestResources, 6000);
setInterval(requestBackups, 40000);
setInterval(requestIpv6, 40000);
setInterval(requestDrives, 40000);
setInterval(requestMods, 40000);

function setServices(data) {
  hamachiImg.src = './img/' + data.hamachi + '.svg';
  minecraftServerImg.src = './img/' + data.minecraftServer + '.svg';
  backupUtilityImg.src = './img/' + data.backupUtility + '.svg';
}

function setResources(data) {
  shiftArray(cpuGraph);
  shiftArray(ramGraph);
  shiftArray(swapGraph);
  cpuGraph[9] = data.cpu;
  ramGraph[9] = data.ram;
  swapGraph[9] = data.swap;
  let cpuDivs = cpuDiv.getElementsByTagName('div');
  let ramDivs = ramDiv.getElementsByTagName('div');
  let swapDivs = swapDiv.getElementsByTagName('div');
  for(let i = 0; i < cpuDivs.length; i++)
    cpuDivs[i].style.height = cpuGraph[i] + 'px';
  for(let i = 0; i < ramDivs.length; i++)
    ramDivs[i].style.height = ramGraph[i] + 'px';
  for(let i = 0; i < swapDivs.length; i++)
    swapDivs[i].style.height = swapGraph[i] + 'px';
}

function setBackups(data) {
  let backups = data.backups;
  backupsDiv.innerHTML = '';
  for(let i = 0; i < backups.length; i++) {
    let backup = document.createElement('div');
    backup.classList = 'backup';
    let nameSpan = document.createElement('span');
    let sizeSpan = document.createElement('span');
    nameSpan.innerText = backups[i].name;
    sizeSpan.innerText = backups[i].size;
    backup.appendChild(nameSpan);
    backup.appendChild(sizeSpan);
    backupsDiv.appendChild(backup);
  }
}

function setIpv6(data) {
  ipv6Div.innerText = data.ipv6;
}

function setDrives(data) {
  systemDiv.style.width = data.system * 3 + 'px';
  serverDiv.style.width = data.server * 3 + 'px';
}

function setMods(data) {
  let mods = data.mods;
  modsDiv.innerHTML = '';
  for(let i = 0; i < mods.length; i++) {
    let mod = document.createElement('div');
    mod.classList = 'mod';
    mod.innerText = mods[i];
    modsDiv.appendChild(mod);
  }
}

function shiftArray(array) {
  for(let i = 1; i < array.length; i++)
    array[i - 1] = array[i];
}