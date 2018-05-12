const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mazenet");
      dbo.collection("post").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.render('index.ejs',{posts: result});
        db.close();
      });
    });

});

// Shine medee nemeh
app.post('/',(req,res)=>{
    var newpost = {
      "title" : `${req.body.title}`,
      "description" : `${req.body.description}`,
      "date": new Date(),
      "tags" : req.body.tags.split(','),
      "comment" : [
      ],
      "rate" : 0,
      "url" : `${req.body.url}`
    };
    console.log(newpost);
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mazenet");
      dbo.collection("post").insertOne(newpost, function(err, res) {
          if (err) throw err;
          console.log("1 post inserted");
          db.close();
        });
      });
    res.redirect('/');
  });

app.get('/:postUrl',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mazenet");
    dbo.collection("post").findOne({url: `/${req.params.postUrl}`}, function(err, result) {
      if (err) throw err;
      if (result == null){
        res.send(`${ 'localhost:4000/'+ req.params.postUrl} This page haven't in website!!!`);
      }else{
        res.render('post.ejs',{post: result});
        db.close();
      }
    });
  });
});

app.post("/:postUrl",(req,res)=>{
  var myquery = { url: `/${req.params.postUrl}`};
  var comment = {
    userName: `${req.body.userName}`,
    userEmail: `${req.body.userEmail}`,
    userComment: `${req.body.userComment}`
  };
  console.log(comment);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mazenet");
    var newvalues = {
      $push: {
        comment: {
            userName: `${req.body.userName}`,
            userEmail: `${req.body.userEmail}`,
            userComment: `${req.body.userComment}`,
            commentDate: new Date()
        }
      }
    };
    dbo.collection("post").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  res.redirect(`${req.params.postUrl}`);
});

app.listen(4000,()=>{
  console.log('server started localhost:4000...');
});
