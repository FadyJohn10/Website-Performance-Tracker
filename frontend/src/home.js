import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:5500/')
        .then(res => {
            if(res.data.Status === "Success"){
                setAuth(true);
                // Navigate('/login');
            }else{
                navigate('/login');
            }
        })
    })

    const handleDelete = () => {
        axios.get('http://localhost:5500/logout')
        .then(res => {
            window.location.reload(true);
        }).catch(err => console.log(err));
    }

    return (
       <div>
            {
                auth ?
                <div>
                    <h2>IT IS MY HOME</h2>
                    <button onClick={handleDelete}>log out</button>
                </div>
                :
                <h2>not authorized</h2>
            }
       </div>
    )
}


export default Home;