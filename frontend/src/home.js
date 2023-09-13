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

    const urlSubmit = (e) => {
        e.preventDefault();
        let url = document.getElementById("url").value;
        console.log(url);
        axios.post('http://localhost:5500/urlsubmit', {url})
        .then(res => {
            if(res.data.Status === 'Success'){
                console.log("sent");
            }
        })
        .then(err => console.log(err));
    }

    return (
       <div>
            {
                auth ?
                <div>
                    <h2>IT IS MY HOME</h2>
                    <button onClick={handleDelete}>log out</button>
                    <br/>
                    <form onSubmit={urlSubmit}>
                        <input type="url" id="url" name="url" placeholder="enter a website url"></input>
                        <input type="submit" value="submit"></input>
                    </form>
                </div>
                :
                <h2>not authorized</h2>
            }
       </div>
    )
}


export default Home;