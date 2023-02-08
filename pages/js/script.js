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
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: '',
    success: setServicesStatus,
    error: (req, err) => {
      console.log(err);
    }
  });
}

setInterval(requestData, 10000);

function setServicesStatus(data) {
  console.log(data);
  hamachiSpan.classList = 'status ' + data['hamachi'];
  minecraftServerSpan.classList = 'status ' + data['minecraftServer'];
}