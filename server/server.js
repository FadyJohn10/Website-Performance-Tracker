import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt, { compare, hash } from 'bcrypt';
import cookieParser from 'cookie-parser';
import {runProgram} from './lhprogram.js';

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

let globalUserId;
let globalURL;

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json({Error: "error logging in"});
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err) return res.json({Error: "Password comapre error"});
                if(response){
                    const name = data[0].name;
                    globalUserId = data[0].id;
                    app.get('/userdata', (req, res) => {
                        // const sql = "SELECT * FROM `users` WHERE `id` = ?";
                        // db.query(sql, [data[0].id], (err, data) => {
                        //     if(data.length > 0){
                        //         res.json(data);
                        //     }else{
                        //         console.log("error fetching user data");
                        //     }
                        // })
                        res.json(data[0]);
                    })
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

app.post('/urlsubmit', async (req, res) => {
    const url = req.body.url;
    globalURL = url;
    console.log("USER ID: ", globalUserId);

    //insert the url into the database
    const sql = "SELECT * FROM `website_urls` WHERE `id` = ? AND `url` = ?";
    db.query(sql, [globalUserId, url], (err, data) => {
        if(data.length > 0){
            console.log("already there");
        }else{
            const sql2 = "INSERT INTO `website_urls` (`url`, `id`, `submitted_at`) VALUES (?, ?, NOW())";
            db.query(sql2, [url, globalUserId], (err, result ) => {
                if(err) return res.json({Error: "sending url to db error"});
                return res.json({Status: "Success"});
            })
        }
    })

    const lhresult = await runProgram(url);
    const performance = lhresult.categories.performance.score * 100;
    const seo = lhresult.categories.seo.score * 100;
    const accessibility = lhresult.categories.accessibility.score * 100;
    const pwa = lhresult.categories.pwa.score * 100;
    const bestPr = lhresult.categories['best-practices'].score * 100;
    // insert the metrices into the db
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const sql3 = "INSERT INTO `metrics` (`id`, `url`, `date`, `performance`, `seo`, `accessibility`, `best_pr`, `pwa`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql3, [globalUserId, url, formattedDate, performance, seo, accessibility, bestPr, pwa], (err, result) => {
        if(err){
            console.log(err);
        }else{
            console.log("dd");
        }
    })

    console.log("done");

})

app.get('/data', (req, res) => {
    const sql = "SELECT * FROM `metrics` WHERE `id` = ? AND `url` = ? ";
    db.query(sql, [globalUserId, globalURL], (err, data) => {
        if(data.length > 0){
            res.json(data);
        }else{
            console.log("error fetching");
        }
    })
})

app.listen(5500, () => {
    console.log("running on port 5500...");
})
