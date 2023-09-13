import React, {useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5500/login', values)
        .then(res => {
            if(res.data.Status === 'Success'){
                navigate('/');
            }else{
                alert(res.data.Error);
            }
        })
        .then(err => console.log(err));
    }

    return (
       <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" name="email" onChange={e => setValues({...values, email: e.target.value})}></input>
                <input type="password" placeholder="Password" name="password" onChange={e => setValues({...values, password: e.target.value})}></input>
                <button type="submit">Login</button>
            </form>
       </div>
    )
}


export default Login;