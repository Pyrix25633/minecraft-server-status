let hamachiImg;
let minecraftServerImg;
let backupUtilityImg;
let cpuDiv;
let ramDiv;
let cpuGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let ramGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let backupsDiv;
let systemDiv;
let serverDiv;
let modsDiv;

function onLoad() {
  hamachiImg = document.getElementById('hamachi');
  minecraftServerImg = document.getElementById('minecraft-server');
  backupUtilityImg = document.getElementById('backup-utility');
  cpuDiv = document.getElementById('cpu');
  ramDiv = document.getElementById('ram');
  backupsDiv = document.getElementById('backups');
  systemDiv = document.getElementById('system');
  serverDiv = document.getElementById('server');
  modsDiv = document.getElementById('mods');
  requestServices();
  requestResources();
  requestBackups();
  requestDrives();
  requestMods();
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
  cpuGraph[9] = data.cpu;
  ramGraph[9] = data.ram;
  let cpuDivs = cpuDiv.getElementsByTagName('div');
  let ramDivs = ramDiv.getElementsByTagName('div');
  for(let i = 0; i < cpuDivs.length; i++)
    cpuDivs[i].style.height = cpuGraph[i] + 'px';
  for(let i = 0; i < ramDivs.length; i++)
    ramDivs[i].style.height = ramGraph[i] + 'px';
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