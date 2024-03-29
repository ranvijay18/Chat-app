var options = {
  rememberUpgrade: true,
  transports: ['websocket'],
  secure: true,
  rejectUnauthorized: false
}
var socket = io.connect('http:// 13.201.137.165:4000', options);

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
const sendFile = document.getElementById("send-file");

let token;
let arrMessages = [];
let userId;
let groupId;

socket.on('chat-message', res => {
  const obj = {
    message: res.message.messages,
    user: res.user,
    mesType: res.message.mesType
  }
  showMessages(obj, res.room);
})

socket.on('chat-file', res => {
  const obj = {
    message: res.message.messages,
    user: res.user,
    mesType: res.message.mesType
  }
  showMessages(obj, res.room);
})

//show all messages when user login
async function getChats(data) {
  const allMessages = data.chat;

  allMessages.forEach(ele => {
    let obj = {
      message: ele.messages,
      user: ele.user.username,
      mesType: ele.mesType
    }

    arrMessages.push(obj);
  });
  const gId = localStorage.getItem("groupId");
  arrMessages.forEach(ele => {
    showMessages(ele, gId);
  });




  // setInterval(async () => {

  //   const newArrData = JSON.parse(localStorage.getItem('arrData'));

  //   const size = newArrData.length;
  //     const res = await axios.get(`http:// 13.201.137.165:4000/new-message/${groupId}/${size}`,{headers: {"Authorization": token}});
  //     const newData = res.data;
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
  const obj = {
    mes
  }
  const res = await axios.post(`http://13.201.137.165:4000/add-message/${userId}/${groupId}`, obj);
  const resObj = {
    message: res.data.message.messages,
    user: res.data.user.username,
    mesType: res.data.message.mesType
  }
  socket.emit('new-message', res.data.message, gId);
  showMessages(resObj, groupId);
  sendInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

//show message function
function showMessages(res, gId) {

  const check = localStorage.getItem("groupId");
  const User = localStorage.getItem("username");
  if (gId == check) {
    if (User === res.user) {
      if (res.mesType === "text") {
        var messageContainer = document.createElement('div');
        messageContainer.id = "outgoing-message-container";
        var p = document.createElement('p');
        p.id = "user-name";
        p.textContent = res.user;
        messageContainer.appendChild(p);

        var p1 = document.createElement('p');
        p1.className = "message";
        p1.textContent = res.message;
        messageContainer.appendChild(p1);
      } else {
        if (res.mesType.startsWith('image')) {
          var messageContainer = document.createElement('div');
          messageContainer.id = "outgoing-message-container";
          var p = document.createElement('p');
          p.id = "user-name";
          p.textContent = res.user;
          messageContainer.appendChild(p);
          const img = document.createElement('img')
          img.src = res.message;
          messageContainer.appendChild(img)

          chatWindow.appendChild(messageContainer);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        } else if (res.mesType.startsWith('video')) {
          var messageContainer = document.createElement('div');
          messageContainer.id = "outgoing-message-container";
          var p = document.createElement('p');
          p.id = "user-name";
          p.textContent = res.user;
          messageContainer.appendChild(p);
          const video = document.createElement('video');
          const source = document.createElement('source');
          source.src = res.message;
          video.appendChild(source);
          video.controls = true;
          messageContainer.appendChild(video);

          chatWindow.appendChild(messageContainer);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      }
    } else {
      if (res.mesType === "text") {
        var messageContainer = document.createElement('div');
        messageContainer.id = "incoming-message-container";

        var p = document.createElement('p');
        p.id = "user-name";
        p.textContent = res.user;
        messageContainer.appendChild(p);

        var p1 = document.createElement('p');
        p1.className = "message";
        p1.textContent = res.message;
        messageContainer.appendChild(p1);
      } else {
        if (res.mesType.startsWith('image')) {
          var messageContainer = document.createElement('div');
          messageContainer.id = "incoming-message-container";
          var p = document.createElement('p');
          p.id = "user-name";
          p.textContent = res.user;
          messageContainer.appendChild(p);
          const img = document.createElement('img')
          img.src = res.message;
          messageContainer.appendChild(img)

          chatWindow.appendChild(messageContainer);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        } else if (res.mesType.startsWith('video')) {
          var messageContainer = document.createElement('div');
          messageContainer.id = "incoming-message-container";
          var p = document.createElement('p');
          p.id = "user-name";
          p.textContent = res.user;
          messageContainer.appendChild(p);
          const video = document.createElement('video');
          const source = document.createElement('source');
          source.src = res.message;
          video.appendChild(source);
          video.controls = true;
          messageContainer.appendChild(video);

          chatWindow.appendChild(messageContainer);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      }
    }

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

  const res = await axios.post(`http://13.201.137.165:4000/create-group/${userId}`, obj);

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
  const res = await axios.get('http://13.201.137.165:4000/show-groups', { headers: { "Authorization": token } });

  userId = res.data.user.id;
  localStorage.setItem("username", res.data.user.username);
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
      const res = await axios.get(`http://13.201.137.165:4000/group-messages/${id}`, { headers: { "Authorization": token } });
      userId = res.data.userId;
      groupId = res.data.group.id;
      groupHeading.textContent = res.data.group.groupName;
      arrMessages = [];
      getChats(res.data);
      const room = res.data.group.id;
      socket.emit('join-room', room);
      socket.on("join-mes", res => {
        if(groupId === res.room){
        var p = document.createElement('p');
        p.className = "user-joined";
        p.textContent = res.user+" joined";
        chatWindow.appendChild(p);
      }
      })

      var p = document.createElement('p');
      p.className = "user-joined";
      p.textContent = "You joined";
      chatWindow.appendChild(p);
      chatWindow.scrollTop = chatWindow.scrollHeight;


      const checkAdmin = await axios.get(`http://13.201.137.165:4000/isAdmin/${res.data.group.id}/${userId}`);
      localStorage.setItem("isAdmin", checkAdmin.data.status);

    })
  })
})



//join group
joinGroup.addEventListener('submit', async (e) => {
  e.preventDefault();
  const groupLink = e.target.joinGroup.value;
  token = localStorage.getItem("token");

  const res = await axios.get(`${groupLink}`, { headers: { "Authorization": token } });

  const status = res.data.status;

  if (status) {
    alert("You join to group successfully");
    location.reload();
  } else {
    alert("Something gone wrong");
  }
})


//admin power
extraDetails.addEventListener("click", async (e) => {
  e.preventDefault();
  const checkAdmin = localStorage.getItem("isAdmin");
  if (checkAdmin === "true") {
    while (chatContainer.firstChild) {
      chatContainer.removeChild(chatContainer.firstChild);
    }
    const gId = localStorage.getItem("groupId");

    const resUser = await axios.get(`http://13.201.137.165:4000/get-member/${gId}`, { headers: { "Authorization": token } });

    var div0 = document.createElement('div');
    div0.id = "extra-features";
    chatContainer.appendChild(div0);

    var div1 = document.createElement('div');
    div1.id = "members";

    var h1 = document.createElement('h1');
    h1.textContent = "Members";
    div1.appendChild(h1);

    var div = document.createElement('div');
    div.id = "members-lists";

    //add member list
    resUser.data.admins.users.forEach(ele => {
      var button = document.createElement('button');
      button.className = "member-btn";
      button.id=ele.id;
      button.style.color = "rgb(0, 255, 0)";
      button.textContent = ele.username;
      div.appendChild(button);

      var br = document.createElement('br');
      div.appendChild(br);

      button.addEventListener('click', () => {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = `
        <p>Would you like to add or remove ${ele.username}?</p>
        <button id="addAdmin">Remove as Admin</button>
        <button id="removeMBtn">Remove</button>
      `;

      dialog.addEventListener("click", async (event) => {
        const userId = ele.id;
        const gId = localStorage.getItem("groupId");
        const obj = {
          userId,
          gId
        }
        if (event.target.id === "removeMBtn") {
          const removeM = await axios.get(`http://13.201.137.165:4000/remove-user/${userId}/${gId}`, { headers: { "Authorization": token } });
          div.removeChild(button);
          alert(removeM.data);
        } else if (event.target.id === "addAdmin") {
          const addAdmin = await axios.get(`http://13.201.137.165:4000/remove-admin/${userId}/${gId}`, { headers: { "Authorization": token } });
          button.style.color = "white";
          alert(addAdmin.data);
        }
        dialog.close();
      });

      document.body.appendChild(dialog);
      dialog.showModal();
    })
  })

    resUser.data.nA.users.forEach(ele => {
      var button = document.createElement('button');
      button.className = "member-btn";
      button.id=ele.id;
      button.textContent = ele.username;
      div.appendChild(button);

      var br = document.createElement('br');
      div.appendChild(br);

      button.addEventListener('click', () => {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = `
        <p>Would you like to add or remove ${ele.username}?</p>
        <button id="addAdmin">Make Admin</button>
        <button id="removeMBtn">Remove</button>
      `;

      dialog.addEventListener("click", async (event) => {
        const userId = ele.id;
        const gId = localStorage.getItem("groupId");
        const obj = {
          userId,
          gId
        }
        if (event.target.id === "removeMBtn") {
          const removeM = await axios.get(`http://13.201.137.165:4000/remove-user/${userId}/${gId}`, { headers: { "Authorization": token } });
          div.removeChild(button);
          alert(removeM.data);
        } else if (event.target.id === "addAdmin") {
          const addAdmin = await axios.get(`http://13.201.137.165:4000/add-admin/${userId}/${gId}`, { headers: { "Authorization": token } });
          button.style.color = "rgb(0, 255, 0)";
          alert(addAdmin.data);
        }
        dialog.close();
      });

      document.body.appendChild(dialog);
      dialog.showModal();
    })
    })

    div1.appendChild(div);
    div0.appendChild(div1);

    var div2 = document.createElement('div');
    div2.id = "addingFeature";
    div0.appendChild(div2);

    var p = document.createElement('p');
    p.id="groupLinkHead";
    p.textContent = "Group Link:-";
    div2.appendChild(p);

    var p = document.createElement('p');
    p.id="groupLink";
    p.textContent = "http://13.201.137.165:4000/join-group/"+ groupId;
    div2.appendChild(p);

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
      const res = await axios.get(`http://13.201.137.165:4000/get-user/${email}`, { headers: { "Authorization": token } });

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
      `;

        dialog.addEventListener("click", async (event) => {
          const userId = res.data.id;
          const gId = localStorage.getItem("groupId");
          const obj = {
            userId,
            gId
          }
          if (event.target.id === "addMBtn") {
            const addM = await axios.post(`http://13.201.137.165:4000/add-new-user`, obj);
            var button = document.createElement('button');
            alert(addM.data.message);
            if(addM.data.status == true){
      button.className = "member-btn";
      button.id=res.data.id;
      button.textContent = res.data.username;
      div.appendChild(button);

      var br = document.createElement('br');
      div.appendChild(br);
            }

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

//send files
sendFile.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileU = document.getElementById('file');
  const file = e.target.file.files[0];
  const formData = new FormData();
  formData.append('file', file)
  const gId = localStorage.getItem("groupId");
  const res = await axios.post(`http://13.201.137.165:4000/message/upload/${gId}/${userId}`, formData);
  socket.emit("upload", res.data.message, gId);
  const obj = {
    message: res.data.message.messages,
    user: res.data.user.username,
    mesType: res.data.message.mesType
  }
  showMessages(obj, gId);
})



