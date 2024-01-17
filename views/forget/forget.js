const form = document.getElementById('form');

form.addEventListener('submit' , async (e) => {

    e.preventDefault();

    const email = e.target.email.value;

    const obj ={
        email
    }
   const res = await axios.post('http://13.232.159.145/password/forgetpassword', obj)
   console.log(res.data);
})