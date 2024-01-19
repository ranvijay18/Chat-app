const form = document.getElementById('form');

form.addEventListener('submit' , async (e) => {

    e.preventDefault();

    const email = e.target.email.value;

    const obj ={
        email
    }
   const res = await axios.post('http://localhost:4000/password/forgetpassword', obj)
   console.log(res.data);
})