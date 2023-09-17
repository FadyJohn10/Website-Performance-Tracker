import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MySidebar from "./navbar";
import UrlInput from "./urlinput";
import ChartComponent from "./ChartComponent";
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
    
    // Fetching yser data
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        axios
        .get('http://localhost:5500/userdata')
        .then((response) => {
            setUserData(response.data);
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    return (
       <div>
            {
                auth ?
                <div>                    
                    <Container fluid style={{padding: 0}}>
                        <Row style={{marginRight: 0}}>
                            <Col xs={2} lg={3}>
                                <MySidebar/>
                            </Col>
                            <Col xs={10} lg={8}>
                                <h2 className="text-white mt-5">Welcome, {userData.name}</h2>
                                <p style={{color: '#ccc'}}>Measure your wesbites performance metrics</p>
                                <UrlInput/>
                                <ChartComponent/>
                            </Col>
                        </Row>
                    </Container>
                    

                </div>
                :
                <h2>not authorized</h2>
            }
       </div>
    )
}


export default Home;