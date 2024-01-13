const chatWindow = document.querySelector('#chat-window');
const sendInput = document.querySelector('#chat');
const sendButton = document.querySelector('#send-chat');

sendButton.addEventListener('submit', async (e) => {

    e.preventDefault();
  
    const mes = e.target.chat.value;
    const obj = {
      mes
    }
      const res = axios.post("http://localhost:4000/message", obj);
      const message =  res.data.message
  sendInput.value = '';

  var messageContainer = document.createElement('div');
  messageContainer.id = "message-container";

  var p = document.createElement('p');
  p.className = "message";
  p.textContent = message;
  messageContainer.appendChild(p);

  chatWindow.appendChild(messageContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});