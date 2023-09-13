import React, {useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5500/register', values)
        .then(res => {
            if(res.data.Status === 'Success'){
                navigate('/login');
            }
        })
        .then(err => console.log(err));
    }

    return (
       <div>
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" name="name" onChange={e => setValues({...values, name: e.target.value})}></input>
                <input type="email" placeholder="Email" name="email" onChange={e => setValues({...values, email: e.target.value})}></input>
                <input type="password" placeholder="Password" name="password" onChange={e => setValues({...values, password: e.target.value})}></input>
                <button type="submit">Sign up</button>
            </form>
       </div>
    )
}


export default Register;