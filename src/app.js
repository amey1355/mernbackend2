require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcryptjs");
require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");



const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set('view-engine', 'ejs')



app.get("/", (req, res) => {
    res.render("index.html");
});

app.get("/login", (req, res) => {
    res.render("login.ejs")
})


//Register or Signup check
app.post("/register", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const registerUsers = new Register({
            email: req.body.email,
            password: req.body.password
        })

        //Starting of password hash

        //It will go to registers.js page and do this actions there and then the work below this will continue again.

        //Ending of password hash

        // Start of JWT Auth TOKEN
        console.log("the success part: " + registerUsers);
        const token = await registerUsers.generateAuthToken();
        console.log("the token part: " + token);

        // End of JWT Auth TOKEN


        const registered = await registerUsers.save();
        res.status(201).send("Account Created Successfully");

    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page");
    }
});


//login check

app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part: " + token);

        if (isMatch) {
            res.status(201).render("login.ejs");
        }
        else {
            res.send("Credentials not matching");
        }
    }
    catch (error) {
        res.status(400).send("Invalid Email")
    }
})


//Starting of JWT 
// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//     const token = await jwt.sign({ _id: "" }, "", {
//         expiresIn: "2 seconds"
//     });
//     console.log(token);

//     const userVer = await jwt.verify(token, "");
//     console.log(userVer);
// }
// createToken();
//Ending of JWT 



app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})