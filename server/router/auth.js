const express = require("express");
const jwt = require('jsonwebtoken');

const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/Authenticate")
require('../db/conn');

const User = require("../model/userSchema")

const router = express.Router();

router.get('/', (req, res) => {
    res.send("hello pratham khodwe");
})

// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Fill all the fields" });
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Email already exixts" });
//             }

//             const user = new User({ name, email, phone, work, password, cpassword });

//             user.save().then(() => {
//                 res.status(201).json({ message: "user registration completed" });
//             }).catch((err) => res.status(500).json({ error: "user registration failed" }));
//         }).catch(err => { console.log(err); });


// })
router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Fill all the fields" });
    }

    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "Email already exixts" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "Password does not match" });
        }
        else {
            const user = new User({ name, email, phone, work, password, cpassword });

            const userRegister = await user.save();

            if (userRegister) {
                res.status(201).json({ message: "user registration completed" });
            }


        }

    } catch (err) {
        console.log(err);
    }



})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Fill all the fields" });
    }

    try {
        const userLogin = await User.findOne({ email: email })

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 2592000000),
                httpOnly: true
            });



            if (!isMatch) {
                return res.status(422).json({ error: "Invalid Credintials" });
            }
            else {
                res.status(201).json({ message: "user login succesfull" });
            }

        }
        else {
            return res.status(422).json({ error: "Invalid Credintials" });
        }




    } catch (err) {
        console.log(err);
    }


    // about 
    router.get('/about', authenticate, (req, res) => {
        console.log("hello about")
        res.send(req.rootUser);
    })

    router.get('/getdata', authenticate, (req, res) => {
        console.log("get data")
        res.send(req.rootUser);
    })


})

module.exports = router;