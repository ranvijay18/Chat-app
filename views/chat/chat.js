const chatWindow = document.querySelector('#chat-window');
const sendInput = document.querySelector('#chat');
const sendButton = document.querySelector('#send-chat');
const createGroup = document.getElementById('create-group');
const showGroups = document.getElementById('show-groups');
const groupHeading = document.getElementById('group-head-name');
const joinGroup = document.getElementById('join-group');
const extraDetails = document.getElementById('details');
const extraFeature = document.getElementById('extra-features');
const sendContainer = document.getElementById('send-container')

let token;
let arrMessages = [];
let userId;
let groupId;

//show all messages when user login
async function getChats(data) {
  const allMessages = data.chat;

  allMessages.forEach(ele => {
    let obj = {
      message: ele.messages,
      user: ele.user.username
    }

    arrMessages.push(obj);
  });
  arrMessages.forEach(ele => {
    showMessages(ele);
  })

  localStorage.setItem('arrData', JSON.stringify(arrMessages));




  // setInterval(async () => {

  //   const newArrData = JSON.parse(localStorage.getItem('arrData'));

  //   const size = newArrData.length;
  //     const res = await axios.get(`http://localhost:4000/new-message/${groupId}/${size}`,{headers: {"Authorization": token}});
  //     const newData = res.data;
  //      console.log(newData);
    //   const mes = newData.messages;
    //   const user = newData.user.username;

    //   let obj = {
    //     message: mes,
    //     user: user
    //   }
    //   newArrData.push(obj);

    //   localStorage.setItem('arrData', JSON.stringify(newArrData));
    //   while (chatWindow.firstChild) {
    //     chatWindow.removeChild(chatWindow.firstChild);
    // }
    //   newArrData.forEach(ele => {
    //     showMessages(ele);
    // })
  // },1000);

};

//add-new message
sendButton.addEventListener('submit', async (e) => {

  e.preventDefault();
  const mes = e.target.chat.value;
  const obj = {
    mes
  }
  const res = await axios.post(`http://localhost:4000/add-message/${userId}/${groupId}`, obj);
  sendInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

//show message function
function showMessages(res) {
  var messageContainer = document.createElement('div');
  messageContainer.id = "message-container";

  var p = document.createElement('p');
  p.className = "message";
  p.textContent = res['user'] + ": " + res['message'];
  messageContainer.appendChild(p);

  chatWindow.appendChild(messageContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

//create group

createGroup.addEventListener('submit', async (e) => {
  e.preventDefault();
  const groupName = e.target.group.value;
  const obj = {
    groupName
  }

  const res = await axios.post(`http://localhost:4000/create-group/${userId}`, obj);

  const status = res.data.status;

  if (status) {
    alert("Group is created successfully");
  } else {
    alert("Something gone wrong");
  }
})

//show groups

window.addEventListener("DOMContentLoaded", async () => {
  token = localStorage.getItem("token");
  const res = await axios.get('http://localhost:4000/show-groups', { headers: { "Authorization": token } });

  userId = res.data.user;
  res.data.groups.forEach(ele => {

    var button = document.createElement('button');
    button.id = ele['id']
    button.textContent = ele['groupName'];
    showGroups.appendChild(button);

    var br = document.createElement('br');
    showGroups.appendChild(br);


    button.addEventListener("click", async (e) => {
      e.preventDefault();
      while (chatWindow.firstChild) {
        chatWindow.removeChild(chatWindow.firstChild);
      }
      const id = ele['id'];
      token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:4000/group-messages/${id}`, { headers: { "Authorization": token } });
      console.log(res.data);
      userId = res.data.userId;
      groupId = res.data.group.id;
     
      groupHeading.textContent = res.data.group.groupName;
     arrMessages = [];
      getChats(res.data);

    })
  })
})


//join group
joinGroup.addEventListener('submit', async (e)=> {
  e.preventDefault();
  console.log(userId);
  const groupLink = e.target.joinGroup.value;
  token = localStorage.getItem("token");

  const res = await axios.get(`${groupLink}`, { headers: { "Authorization": token } });

  const status = res.data.status;

  if (status) {
    alert("You join to group successfully");
  } else {
    alert("Something gone wrong");
  }
})


//admin power
extraDetails.addEventListener("click", (e) => {
  alert("hello");
  e.preventDefault();
  while (chatWindow.firstChild) {
    chatWindow.removeChild(chatWindow.firstChild);
  }
  while (sendContainer.firstChild) {
    sendContainer.removeChild(sendContainer.firstChild);
  }
  extraFeature.style.display="inline-flex";
});


