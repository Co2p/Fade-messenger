window.addEventListener('load', () => {
  setName(Cookies.get('username'))
  notificationRequest();
});

var socket = io();

$('form').submit(function(){
  if ($('#m').val() != "") {
    const msg = [$('#m').val(), Cookies.get('username')];
    socket.emit('chat message', msg);
    $('#m').val('');
  }
  return false;
});

socket.on('chat message', function(msg){
  let parmess = msg[1] + ': ' + msg[0];
  $('#messages').append($('<li>').addClass('messagecontainer').append('<div>'));
  $('#messages li div').last().append($('<div>').addClass('mdl-chip'));
  if (msg[1] == Cookies.get('username')) {
    $('#messages li div div').last().addClass('mymessage mdl-chip__text mdl-color--accent mdl-color-text--white');
    parmess = msg[0]
  } else {
    $('#messages li div div').last().addClass('othermessage mdl-chip__text');
    notifyText(parmess);
    notifySound();
  }
  $('#messages li div').last().text(parmess);
  var scrollBottom = $(window).scrollTop() + $(window).height();
  $('main').animate({scrollTop: $(document).height() + $(window).height()});
});


function setName(username) {
  while (!username) {
    username = prompt("Pick a username", "");
  }
  Cookies.set('username', username);
}


function notifySound() {

  var playPromise = document.querySelector('audio').play();
  // In browsers that don’t yet support this functionality,
  // playPromise won’t be defined.
  if (playPromise !== undefined) {
    playPromise.then(function() {
      // Automatic playback started!
    }).catch(function(error) {
      // Automatic playback failed.
      // Show a UI element to let the user manually start playback.
      console.log(error);
    });
  }
}

function notifyText(msg) {
  try {
    if (Notification.permission === "granted") {
      var n = new Notification(msg);
      setTimeout(n.close.bind(n), 2000);
    }
  } catch(err) {
    console.log(err);
  }
}

function notificationRequest() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else {
    try {
      if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          if (permission === "granted") {
          }
        });
      }
    } catch(err) {
      console.log(err);
    }
  }
}
