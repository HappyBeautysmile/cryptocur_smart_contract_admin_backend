const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const routes = require("./routes");
const logger = require("morgan");
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use("*",(req,res,next)=>{
    let expires = new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000);
    res.cookie('cookie1', 'value1', { sameSite: 'lax',httpOnly : true ,expires :expires ,path : "/" });   next(); });
app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(flash())
app.use(express.static("client/build"));
app.use("/api", routes);
app.listen(PORT, (err)=> {
    if (err) throw err;
    console.log(`connected on port ${PORT}`)
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/zedcoin", { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true }, function(err) {
    if (err) throw err;
    console.log(`mongoose connection successful`);
});



