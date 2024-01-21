const form = document.getElementById('form');



form.addEventListener("submit" , async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const obj = {
        password
    }
    const res = axios.post('http://localhost:4000/password/newpassword', obj)
    alert("Your password changed successfully");
    window.location.href = "../login/login.html";
})