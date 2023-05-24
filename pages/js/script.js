const refreshImg = document.getElementById('refresh');
const noipDucImg = document.getElementById('noip-duc');
const hamachiImg = document.getElementById('hamachi');
const minecraftServerImg = document.getElementById('minecraft-server');
const backupUtilityImg = document.getElementById('backup-utility');
const cpuNowSpan = document.getElementById('cpu-now');
const ramNowSpan = document.getElementById('ram-now');
const swapNowSpan = document.getElementById('swap-now');
const cpuDiv = document.getElementById('cpu');
const ramDiv = document.getElementById('ram');
const swapDiv = document.getElementById('swap');
const cpuGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const ramGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const swapGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const pyrixjmplayzDiv = document.getElementById('pyrixjmplayz');
const cobblemonDiv = document.getElementById('cobblemon');
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
const tpsOverworldNowSpan = document.getElementById('tps-overworld-now');
const tpsNetherNowSpan = document.getElementById('tps-nether-now');
const tpsEndNowSpan = document.getElementById('tps-end-now');
const tpsOverworldDiv = document.getElementById('tps-overworld');
const tpsNetherDiv = document.getElementById('tps-nether');
const tpsEndDiv = document.getElementById('tps-end');
const tpsOverworldGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const tpsNetherGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const tpsEndGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function onLoad() {
  requestServices();
  requestResources();
  requestBackups();
  requestIpv6();
  requestDrives();
  requestStatus();
  requestStatusFullQuery();
  requestStatusTps();
}

refreshImg.addEventListener('click', () => {
  requestServices('?force=true');
  requestResources('?force=true');
  requestBackups('?force=true');
  requestIpv6('?force=true');
  requestDrives('?force=true');
  requestStatus('?force=true');
  requestStatusTps('?force=true');
});

function requestServices(args = '') {
  $.ajax({
    url: '/services' + args,
    method: 'GET',
    dataType: 'json',
    success: setServices,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestResources(args = '') {
  $.ajax({
    url: '/resources' + args,
    method: 'GET',
    dataType: 'json',
    timeout: 4000,
    success: setResources,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestBackups(args = '') {
  $.ajax({
    url: '/backups' + args,
    method: 'GET',
    dataType: 'json',
    success: setBackups,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestIpv6(args = '') {
  $.ajax({
    url: '/ipv6' + args,
    method: 'GET',
    dataType: 'json',
    success: setIpv6,
    error: (req, err) => {
      console.log(err);
    }
  });
}

function requestDrives(args = '') {
  $.ajax({
    url: '/drives' + args,
    method: 'GET',
    dataType: 'json',
    success: setDrives,
    error: (req, err) => {
      console.log(err);
    }
  });
}

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

setInterval(requestServices, 6000);
setInterval(requestResources, 6000);
setInterval(requestBackups, 40000);
setInterval(requestIpv6, 40000);
setInterval(requestDrives, 40000);
setInterval(requestStatus, 40000);
setInterval(requestStatusFullQuery, 6000);
setInterval(requestStatusTps, 6000);

function setServices(data) {
  noipDucImg.src = './img/' + data.noipDuc + '.svg';
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
  cpuNowSpan.innerText = data.cpu;
  for(let i = 0; i < cpuDivs.length; i++)
    cpuDivs[i].style.height = cpuGraph[i] + 'px';
  ramNowSpan.innerText = data.ram;
  for(let i = 0; i < ramDivs.length; i++)
    ramDivs[i].style.height = ramGraph[i] + 'px';
  swapNowSpan.innerText = data.swap;
  for(let i = 0; i < swapDivs.length; i++)
    swapDivs[i].style.height = swapGraph[i] / 2 + 'px';
}

function setBackups(data) {
  let pyrixjmplayz = data.pyrixjmplayz;
  pyrixjmplayzDiv.innerHTML = '';
  for(let i = 0; i < pyrixjmplayz.length; i++) {
    let backup = document.createElement('div');
    backup.classList = 'backup';
    let nameSpan = document.createElement('span');
    let sizeSpan = document.createElement('span');
    nameSpan.innerText = pyrixjmplayz[i].name;
    sizeSpan.innerText = pyrixjmplayz[i].size;
    backup.appendChild(nameSpan);
    backup.appendChild(sizeSpan);
    pyrixjmplayzDiv.appendChild(backup);
  }
  let cobblemon = data.cobblemon;
  cobblemonDiv.innerHTML = '';
  for(let i = 0; i < cobblemon.length; i++) {
    let backup = document.createElement('div');
    backup.classList = 'backup';
    let nameSpan = document.createElement('span');
    let sizeSpan = document.createElement('span');
    nameSpan.innerText = cobblemon[i].name;
    sizeSpan.innerText = cobblemon[i].size;
    backup.appendChild(nameSpan);
    backup.appendChild(sizeSpan);
    cobblemonDiv.appendChild(backup);
  }
}

function setIpv6(data) {
  ipv6Div.innerText = data.ipv6;
}

function setDrives(data) {
  systemDiv.style.width = data.system * 3 + 'px';
  serverDiv.style.width = data.server * 3 + 'px';
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
}