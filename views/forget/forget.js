const form = document.getElementById('form');

form.addEventListener('submit' , async (e) => {

    e.preventDefault();

    const email = e.target.email.value;

    const obj ={
        email
    }
   const res = await axios.post('http://13.201.137.165:4000/password/forgetpassword', obj)
})