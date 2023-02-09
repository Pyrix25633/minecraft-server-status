let hamachiImg;
let minecraftServerImg;
let backupUtilityImg;

function onLoad() {
  hamachiImg = document.getElementById('hamachi');
  minecraftServerImg = document.getElementById('minecraft-server');
  backupUtilityImg = document.getElementById('backup-utility');
  requestData();
}

function requestData() {
  $.ajax({
    url: '/services',
    method: 'GET',
    dataType: 'json',
    success: setServicesStatus,
    error: (req, err) => {
      console.log(err);
    }
  });
}

setInterval(requestData, 6000);

function setServicesStatus(data) {
  hamachiImg.src = './img/' + data.hamachi + '.svg';
  minecraftServerImg.src = './img/' + data.minecraftServer + '.svg';
  backupUtilityImg.src = './img/' + data.backupUtility + '.svg';
}