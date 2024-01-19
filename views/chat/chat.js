var options = {
  rememberUpgrade: true,
  transports: ['websocket'],
  secure: true,
  rejectUnauthorized: false
}
var socket = io.connect('http://localhost:4000', options);

const chatWindow = document.querySelector('#chat-window');
const sendInput = document.querySelector('#chat');
const sendButton = document.querySelector('#send-chat');
const createGroup = document.getElementById('create-group');
const showGroups = document.getElementById('show-groups');
const groupHeading = document.getElementById('group-head-name');
const joinGroup = document.getElementById('join-group');
const extraDetails = document.getElementById('details');
const extraFeature = document.getElementById('extra-features');
const sendContainer = document.getElementById('send-container');
const chatContainer = document.getElementById('chat-container');
const flexBox = document.getElementById('flex-box');

let token;
let arrMessages = [];
let userId;
let groupId;

socket.on('chat-message', res=> {
 console.log(res.room);
  showMessages(res , res.room);
})

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
  const gId = localStorage.getItem("groupId");
  arrMessages.forEach(ele => {
    showMessages(ele, gId);
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
  const gId = localStorage.getItem("groupId");
  socket.emit('new-message', mes,gId);
  const obj = {
    mes
  }
  const res = await axios.post(`http://localhost:4000/add-message/${userId}/${groupId}`, obj);
  const resObj = {
    message: res.data.message.messages,
    user: res.data.user.username
  }
  showMessages(resObj, groupId);
  sendInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

//show message function
function showMessages(res, gId) {

  const check = localStorage.getItem("groupId");
  if(gId == check){
  var messageContainer = document.createElement('div');
  messageContainer.id = "message-container";

  var p = document.createElement('p');
  p.className = "message";
  p.textContent = res.user + ": " + res.message;
  messageContainer.appendChild(p);

  chatWindow.appendChild(messageContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
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
    location.reload();
  } else {
    alert("Something gone wrong");
  }
})

//show groups
window.addEventListener("DOMContentLoaded", async () => {
  token = localStorage.getItem("token");
  const res = await axios.get('http://localhost:4000/show-groups', { headers: { "Authorization": token } });

  userId = res.data.user.id;
  socket.emit('username', res.data.user.username);
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
      localStorage.setItem("groupId", ele['id']);
      token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:4000/group-messages/${id}`, { headers: { "Authorization": token } });
      userId = res.data.userId;
      groupId = res.data.group.id;
      groupHeading.textContent = res.data.group.groupName;
      arrMessages = [];
      getChats(res.data);
      const room = res.data.group.id;
      socket.emit('join-room', room);
     
      var p = document.createElement('p');
      p.className = "user-joined";
      p.textContent =  "You joined";
      chatWindow.appendChild(p);


      const checkAdmin = await axios.get(`http://localhost:4000/isAdmin/${res.data.group.id}/${userId}`);
      localStorage.setItem("isAdmin", checkAdmin.data.status);
      console.log(checkAdmin.data);

    })
  })
})



//join group
joinGroup.addEventListener('submit', async (e) => {
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
extraDetails.addEventListener("click", async (e) => {
  e.preventDefault();
  const checkAdmin = localStorage.getItem("isAdmin");
  console.log(checkAdmin);
  if (checkAdmin === "true") {
    while (chatContainer.firstChild) {
      chatContainer.removeChild(chatContainer.firstChild);
    }
    const gId = localStorage.getItem("groupId");

    const resUser = await axios.get(`http://localhost:4000/get-member/${gId}`, { headers: { "Authorization": token } });
    console.log(resUser.data);

    var div0 = document.createElement('div');
    div0.id = "extra-features";
    chatContainer.appendChild(div0);

    var div1 = document.createElement('div');
    div1.id = "members";

    var h1 = document.createElement('h1');
    h1.textContent = "Members";
    div1.appendChild(h1);

    var ul = document.createElement('ul');

    //add member list
    resUser.data.forEach(ele => {
      var li = document.createElement('li');
      li.textContent = ele.username;
      ul.appendChild(li);
    })

    div1.appendChild(ul);
    div0.appendChild(div1);

    var div2 = document.createElement('div');
    div2.id = "addingFeature";
    div0.appendChild(div2);

    var form = document.createElement('form');
    form.id = "add-member";
    div2.appendChild(form);

    var label = document.createElement('label');
    label.textContent = "Search Member";
    form.appendChild(label);

    var br = document.createElement('br')
    form.appendChild(br);

    var input = document.createElement('input');
    input.type = "text";
    input.name = "userEmail";
    input.placeholder = "User Email";
    input.size = "30";
    form.appendChild(input);

    var button = document.createElement('button');
    button.type = "submit";
    button.id = "addBtn";
    button.textContent = "Search"
    form.appendChild(button);

    var div3 = document.createElement('div');
    div3.id = "searchedMember";
    div2.appendChild(div3);


    const addMember = document.getElementById('add-member');
    const searchedMember = document.getElementById('searchedMember');

    addMember.addEventListener("submit", async (e) => {
      e.preventDefault();
      while (searchedMember.firstChild) {
        searchedMember.removeChild(searchedMember.firstChild);
      }
      const email = e.target.userEmail.value;
      const res = await axios.get(`http://localhost:4000/get-user/${email}`, { headers: { "Authorization": token } });
      console.log(res.data);

      var button2 = document.createElement('button');
      button2.id = res.data.id;
      button2.textContent = res.data.username;
      div3.appendChild(button2);
      const user = res.data.username;

      button2.addEventListener('click', () => {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = `
        <p>Would you like to add or remove ${user}?</p>
        <button id="addMBtn">Add</button>
        <button id="addAdmin">Make Admin</button>
        <button id="removeMBtn">Remove</button>
      `;

        dialog.addEventListener("click", async (event) => {
          const userId = res.data.id;
          const gId = localStorage.getItem("groupId");
          const obj = {
            userId,
            gId
          }
          if (event.target.id === "addMBtn") {
            const addM = await axios.post(`http://localhost:4000/add-new-user`, obj);
            var li = document.createElement('li');
            li.textContent = user;
            ul.appendChild(li);
            alert(addM.data);

          } else if (event.target.id === "removeMBtn") {
            const removeM = await axios.get(`http://localhost:4000/remove-user/${userId}/${gId}`, { headers: { "Authorization": token } });
            alert(removeM.data);
          } else if (event.target.id === "addAdmin") {
            const addAdmin = await axios.get(`http://localhost:4000/add-admin/${userId}/${gId}`, { headers: { "Authorization": token } });
            alert(addAdmin.data);
          }
          dialog.close();
        });

        document.body.appendChild(dialog);
        dialog.showModal();
      })

    })
  } else {
    alert("You are not a admin of this group");
  }



});




