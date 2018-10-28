(function() {
  const lobbyElem = document.getElementById('lobby');

  updateLobby(lobbyElem);

  setInterval(() => updateLobby(lobbyElem), 3000);

  function updateLobby(parentElem) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      let lobbyListing, lobbyContents;
  
      if (xhr.responseText) {
        lobbyListing = JSON.parse(xhr.responseText);
      }
  
      if (lobbyListing && lobbyListing.length) {
        lobbyContents = document.createElement('ul');
        lobbyListing.forEach(room => {
          lobbyContents.appendChild(buildRoomElement(room));
        });
      } else {
        lobbyContents = 'No rooms open, try again later';
      }
      parentElem.innerHTML = '';
      parentElem.append(lobbyContents);
    });
    xhr.open("GET", "/api/hosts");
    xhr.send();
  }

  function buildRoomElement(room) {
    const roomElem = document.createElement('li');
    roomElem.innerHTML = `<a href="${room.entry_url}">${room.display_name}</a>`;
    return roomElem;
  }
})();