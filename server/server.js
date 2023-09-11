import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web tool"
})

db.connect(function(err) {
    if (err) throw err;
  });

app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hashPass) => {
        if(err) return res.json("error hashing the password");
        const values = [
            req.body.name,
            req.body.email,
            hashPass
        ]
        db.query(sql, [values], (err, result ) => {
            if(err) return res.json({Error: "Inserting data errorr"});
            return res.json({Status: "Success"});
        })
        console.log("values are here");
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json({Error: "error logging in"});
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err) return res.json({Error: "Password comapre error"});
                if(response){
                    const name = data[0].name;
                    const token = jwt.sign({name}, 'jwt-secret-key', {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success"});
                }else{
                    return res.json({Error: "password incorrect"});    
                }
            })
        }else{
            return res.json({Error: "Email does not exist"});
        }
    })
})
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        res.json({Error: "Not authenticated"});
    }else{
        jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
            if(err){
                res.json({Error: "token is not valid"});
            }else{
                req.name = decoded.name;
                next();
            }

        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success"});
    
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.listen(5500, () => {
    console.log("running on port 5500...");
})