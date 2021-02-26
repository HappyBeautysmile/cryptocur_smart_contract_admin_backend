
    const express = require('express');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const config = require('./config/db');
    const app = express();
    const server = require("http").Server(app);
    const adminRouter = require("./routes/index");
    const path = require("path");
  
    app.use(cors());
    app.use("*",(req,res,next)=>{
      let expires = new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000);
      res.cookie('cookie1', 'value1', { sameSite: 'lax',httpOnly : true ,expires :expires ,path : "/" });   next(); });
    app.use(express.static('./client'));
    app.use(express.static('./client/stellar_admin_frontend_build'));
    app.use(express.static('./client/upload'));
    app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api',adminRouter);
     
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/stellar_admin_frontend_build/index.html'));  
    });
    
    
    //    start server
    
    mongoose.connect(config.db, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
      console.log('Database is connected');
      server.listen(config.port, () => {
        console.log(`Started server on => http://localhost:${config.port}`);
      });
      },
      err => { console.log('Can not connect to the database'+ err)}
    );
  
  // }
  