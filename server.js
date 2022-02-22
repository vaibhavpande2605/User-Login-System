import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

dotenv.config();

app.use(bodyParser.json());

const URI = process.env.MONGO_URL;

mongoose.connect(
  URI,
  {
    // useCreateIndex:true,
    // usefindAndModify:false,
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    else {
      return console.log("mongodb connected 🔥");
    }
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.post("/login", (req, res) => {
    const {  email, password } = req.body;
    User.findOne({email:email},(err,user)=>{
        if (user) {
            if (password===user.password) {
                res.send({message:"Login Successful ❕❕❕❕❕❕",user:user})
            }
            else{
                res.send({message:"Password din't match ❌❌❌"})
            }
        }
        else{
            res.send({message:"User not registered ⚠️"})
        }
    })
});






app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "user is already exist🚫🚫🚫" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully registered, Please Login ✅✅✅ " });
        }
      });
    }
  });
});

if ( process.env.NODE_ENV == "production"){

  app.use(express.static("client/build"));

  const path = require("path");

  app.get("*", (req, res) => {

      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

  })
}

const PORT = process.env.PORT || 5000;



app.listen(PORT, () =>{
 console.log(`Server running on port ${PORT} 🔥`);
 
 
});
