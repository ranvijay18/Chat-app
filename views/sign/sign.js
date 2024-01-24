const form = document.getElementById('signForm');
const login = document.getElementById('btnLogin');

login.addEventListener('click' , () => {
    window.location.href = "../login/login.html"
})
form.addEventListener('submit' , store);



async function store(e){

    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const phone = e.target.phone.value;

    const obj = {
        username,
        email,
        phone,
        password
    }
    console.log(obj);

    const res = await axios.post('http://13.201.137.165:4000/user', obj)
    
    alert('Account is created successfully. Now you can login')

    window.location.replace("../login/login.html");
     

}