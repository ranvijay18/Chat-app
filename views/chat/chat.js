const chatWindow = document.querySelector('#chats');
const sendInput = document.querySelector('#chatForm');
const sendButton = document.querySelector('#chatForm');

sendButton.addEventListener('submit', (e) => {

    e.preventDefault();
  
    const mes = e.target.chat.value;
    console.log(mes);
  sendInput.value = '';
  chatWindow.innerHTML += mes;
  chatWindow.scrollTop = chatWindow.scrollHeight;
});