const mongo = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const url = "mongodb://167.99.91.93:27017/";

app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
  mongoose.connect(url);
});

app.listen(4000,()=>{
  console.log('server started localhost:4000...');
});
