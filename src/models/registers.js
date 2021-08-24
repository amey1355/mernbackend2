const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//Start of generating tokens

usersSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY); //generating tokens
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}

//End of generating tokens


//Converting Password into hash
usersSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
})

//Collections:

const Register = new mongoose.model("Register", usersSchema);

module.exports = Register;