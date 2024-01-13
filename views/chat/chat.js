const chatWindow = document.querySelector('#chat-window');
const sendInput = document.querySelector('#chat');
const sendButton = document.querySelector('#send-chat');

let token;


window.addEventListener("DOMContentLoaded",async ()=> {
  token = localStorage.getItem("token");
 
  
  setInterval(async () => {
       while (chatWindow.firstChild) {
        chatWindow.removeChild(chatWindow.firstChild);
      }
  const res = await axios.get('http://localhost:4000/all-messages', {headers: {"Authorization": token}});
  const allMessages = res.data;

   const arr = JSON.stringify(allMessages);
   localStorage.setItem('arrData', arr);
   const storedJsonString = localStorage.getItem('arrData');
   const resultArr = JSON.parse(storedJsonString);

resultArr.forEach(ele => {
   showGetMessages(ele);
  });

  },5000);
         
})

sendButton.addEventListener('submit', async (e) => {

    e.preventDefault();
  
    const mes = e.target.chat.value;
    const obj = {
      mes
    }
      const res = await axios.post("http://localhost:4000/message", obj);
      const message =  res.data.message.messages;
      const user = res.data.username;
  sendInput.value = '';
  
  showPostMessage(message,user);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});


function showGetMessages(res){

  var messageContainer = document.createElement('div');
  messageContainer.id = "message-container";

  var p = document.createElement('p');
  p.className = "message";
  p.textContent = res.user['username']+": "+res['messages'];
  messageContainer.appendChild(p);

  chatWindow.appendChild(messageContainer);
}

function showPostMessage(mes , user){
  var messageContainer = document.createElement('div');
  messageContainer.id = "message-container";

  var p = document.createElement('p');
  p.className = "message";
  p.textContent = user+": "+mes;
  messageContainer.appendChild(p);

  chatWindow.appendChild(messageContainer);
}