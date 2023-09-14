//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');


try {
  mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const postSchema = {
  postTitle: String,
  postBody: String
};


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
    Post.find().then(posts => {
      // const posts= await Post.find();
        res.render("home", {
          startingHome : homeStartingContent,
          posts : posts
        });

    })
    .catch(error => {
    
      console.log(error);
    });
    
    // res.sendFile(__dirname +  "/home.html");
});

app.get("/about", function(req, res){

  res.render("about", {aboutPage : aboutContent });
});

app.get("/contact", function(req, res){

  res.render("contact", {contactPage : contactContent });
});


app.get("/compose", function(req, res){

  res.render("compose");
  // console.log("")
  // res.sendFile(__dirname +  "/home.html");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });

  post.save() // Save the post and return a promise
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error saving post:", error);
      // Handle the error appropriately, e.g., render an error page
    });
});


app.get("/posts/:postid" , function(req, res){

  // console.log(req.params.postid);

  const requestedPostId = _.lowerCase(req.params.postid);
  Post.findOne({ postTitle: requestedPostId })
    .then(post => {
      if (post) {
        res.render("post", {
          title: post.postTitle,
          content: post.postBody,
        });
      } else {
        res.send("No post found with the specified ID.");
      }
    })
    .catch(error => {
      console.error("Error retrieving post:", error);
      res.status(500).send("Internal Server Error");
    });

});


app.listen(5000, function() {
  console.log("Server started on port 5000");
});


// app.get("/posts/:postid", function(req, res) {
//   const requestedPostId = _.lowerCase(req.params.postid);

//   Post.findOne({ postTitle: requestedPostId })
//     .then(post => {
//       if (post) {
//         res.render("post", {
//           title: post.postTitle,
//           content: post.postBody,
//         });
//       } else {
//         res.send("No post found with the specified ID.");
//       }
//     })
//     .catch(error => {
//       console.error("Error retrieving post:", error);
//       res.status(500).send("Internal Server Error");
//     });
// });

// app.listen(5000, function() {
//   console.log("Server started on port 5000");
// });