let hamachiImg;
let minecraftServerImg;
let backupUtilityImg;
let cpuDiv;
let ramDiv;
let cpuGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let ramGraph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let modsDiv;

function onLoad() {
  hamachiImg = document.getElementById('hamachi');
  minecraftServerImg = document.getElementById('minecraft-server');
  backupUtilityImg = document.getElementById('backup-utility');
  cpuDiv = document.getElementById('cpu');
  ramDiv = document.getElementById('ram');
  modsDiv = document.getElementById('mods');
  requestServices();
  requestResources();
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
setInterval(requestMods, 20000);

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