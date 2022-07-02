const express = require("express")
const router = express.Router()
const UserModel = require("../models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware
const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

router.post("/welcome", verifyToken, (req, res) => {
  res.status(200).send("Welcome");
});

// Register
router.post("/register", async (req, res) => {

  try {
    const { firstName, lastName, email, password } = req.body;
    // Validate user input
    if (!(email && password && firstName && lastName)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await UserModel.create({
      firstName,
      lastName,
      email: email,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    return res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
});
  
// Login
router.post("/login", async (req, res) => {
   try {
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      return res.status(200).json(user);
    }
     return res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
});

// get all users
router.get("/", async (req,res)=>{
 
  try{
    const users =  await UserModel.find({})
       res.json(users)
  }catch{
    res.json({code: "DB Error"})
  }
})

// get user by Id
router.get("/:id",async (req,res)=>{
  const id = req.params.id
  try{
    const users =  await UserModel.find({_id: id})
       res.json(users)
  }catch{
    res.json({code: "DB Error"})
  }
  
})

// Add new user
router.post("/",async (req,res)=>{

  const userBody = req.body
  const user = new UserModel(userBody)
  try{
    const users =  await user.save()
       res.json("user added")
  }catch{
    res.json({code: "DB Error"})
  }

})

// Edit user
router.put("/:id",async (req,res)=>{
  const id = req.params.id
  try{
    const users =  await UserModel.findByIdAndUpdate(id,req.body)
       res.json("user Updated")
  }catch{
    res.json({code: "DB Error"})
  }
})

// Delete user
router.delete("/:id",async (req,res)=>{
  const id = req.params.id
  try{
    const users =  await UserModel.findByIdAndDelete(id)
       res.json("user Deleted")
  }catch{
    res.json({code: "DB Error"})
  }
 
 
})


module.exports = router