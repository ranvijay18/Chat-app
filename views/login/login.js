const form = document.getElementById('loginForm');
const sign = document.getElementById("btnSign");


sign.addEventListener('click', () => {
    window.location.href = "../sign/sign.html";
})

form.addEventListener('submit' , check);

async function check(e){
      
    e.preventDefault();

    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;


    if(password != confirmPassword){
        alert("Mismatch in Password");
    }else{


    const obj = {
        email,
        phone,
        password
    }
    const res = await axios.post('http://13.201.137.165:4000/login', obj);

    const data = res.data.status;
    const tokenData = res.data.token;
    localStorage.setItem("token", tokenData);

    if(data === true){
        alert("User is Logged In");
        window.location.href = ("../chat/chat.html");
    }else if(data === false){
        alert("Wrong Password");
    }else{
        alert("User not found");
    }
}
}
