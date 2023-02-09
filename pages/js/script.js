let hamachiSpan;
let minecraftServerSpan;

function onLoad() {
  hamachiSpan = document.getElementById('hamachi');
  minecraftServerSpan = document.getElementById('minecraft-server');
  requestData();
}

function requestData() {
  $.ajax({
    url: '/data',
    method: 'GET',
    dataType: 'json',
    success: setServicesStatus,
    error: (req, err) => {
      console.log(err);
    }
  });
}

setInterval(requestData, 10000);

function setServicesStatus(data) {
  hamachiSpan.classList = 'status ' + data['hamachi'];
  minecraftServerSpan.classList = 'status ' + data['minecraftServer'];
}