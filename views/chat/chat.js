const chatWindow = document.querySelector('#chat-window');
const sendInput = document.querySelector('#chat');
const sendButton = document.querySelector('#send-chat');

sendButton.addEventListener('submit', (e) => {

    e.preventDefault();
  
    const mes = e.target.chat.value;
    console.log(mes);
  sendInput.value = '';

  var messageContainer = document.createElement('div');
  messageContainer.id = "message-container";

  var p = document.createElement('p');
  p.className = "message";
  p.textContent = mes;
  messageContainer.appendChild(p);

  chatWindow.appendChild(messageContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});