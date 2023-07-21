const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser")





const app = express();



dotenv.config({ path: './config.env' });
require('./db/conn');
// const User = require('./model/userSchema')

app.use(express.json())
app.use(cookieParser());
app.use(require('./router/auth'));

const PORT = process.env.PORT;





// })
// app.get('/about', middleware, (req, res) => {
//     res.cookie("sdfs", "sdfsd");
//     res.send("about pratham");
// })

app.listen(PORT, () => {
    console.log("server started ");
})