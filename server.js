const express = require('express')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const userFormat = require('./userdataformat')
require('dotenv').config();


app.use(express.json());
app.use(cors());


// mongoose.connect('mongodb+srv://maragoka22_db_user:mymongopASS1@cluster0black.fj4aqpp.mongodb.net/gymUsers?appName=Cluster0black')
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB successful! '))
  .catch((err) => console.log('Connection failed', err));


//   const verifyToken = (req, res, next) => {
//     const token = req.headers['authorization'];

//     if (!token) {
//         return res.json({ message: 'No token provided' });
//     }

//     jwt.verify(token, 'secretkey', (err, decoded) => {
//         if (err) {
//             return res.json({ message: 'Invalid Token' });
//         }

//         req.userId = decoded.id;
//         next();
//     });
// };

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log(authHeader);
console.log(token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ message: "Invalid Token" });
        }

        req.userId = decoded.id;
        next();
    });
};

  app.get('/profile',verifyToken,async(req,res)=>{
    const user = await userFormat.findById(req.userId)
    res.json(user);
  })

app.get('/',(req,res)=>{
    res.send('getting it early by blackoh')
});

app.get('/users', async (req, res) => {
    try {
        const users = await userFormat.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});



app.post('/signup', async(req,res)=>{
    console.log(req.body);
    const{profileName,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new userFormat({profileName,email,password:hashedPassword});
    await user.save();

    res.json({message:'User Registration Complete .Kindly proceed to Login',data:user})
})


app.post('/signin', async(req,res)=>{
    const{profileName,email,password} = req.body;
    const user = await userFormat.findOne({email});
    if(!user) return res.json({message:'User not Found'});

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.json({message:'weong credentials..Try again'});


    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.json({message:'login Successful',token})
  
})


// app.post('/signup',async(req,res)=>{
//     console.log(req.body)
//     const user = new userFormat(req.body)
//     await user.save()

//     res.json({
//         message:'user saved', data:user
//     });
// })

app.listen(process.env.PORT,()=>{
    console.log('Dear blackoh ..server listening via port 3000')
})