const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./routes");
const logger = require("morgan");
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const Dbconfig = require("./config/db");

app.use(cors());
app.use("*",(req,res,next)=>{
    let expires = new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000);
    res.cookie('cookie1', 'value1', { sameSite: 'lax',httpOnly : true ,expires :expires ,path : "/" });   next(); });
app.use(express.static("./client"));
app.use(express.static("./client/build"));
app.use(express.static("./client/upload"));
app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(flash());
app.use("/api", routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));  
  });

app.listen(Dbconfig.port, (err)=> {
    if (err) throw err;
    console.log(`connected on port ${Dbconfig.port}`)
});

mongoose.connect(Dbconfig.db, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true }, function(err) {
    if (err) throw err;
    console.log(`mongoose connection successful`);
});



