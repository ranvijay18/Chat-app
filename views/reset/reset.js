const form = document.getElementById('form');



form.addEventListener("submit" , async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const obj = {
        password
    }
    const res = axios.post('http://13.232.159.145:4000/password/newpassword', obj)
    console.log(res);
    window.location.href = "../login/login.html";
})