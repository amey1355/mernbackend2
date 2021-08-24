//Start of Basic Steps to write 
var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('Forms')) //Html files or other files of singup page will be in that directory so write here that directory we have to write
app.use(bodyParser.urlencoded({
    extended: true
}))
//End of Basic Steps to write 

mongoose.connect("mongodb://localhost:27017/mydb",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error',()=>console.log("Error Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/teachersignin", (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "email": email,
        "password": password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted Successfully");
    });

    return res.redirect('teacherpage.html')
})


app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })

    return res.redirect("navbar.html")
}).listen(3000);

console.log("Listening on PORT 3000");