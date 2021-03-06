var bodyParser = require('body-parser'),
    methodoverride = require('method-override'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express();

mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true, useUnifiedTopology: true });


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodoverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
    res.redirect("/blogs")
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            //console.log("Error");
            res.render("error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, blogs) {
        if (err) {
            //console.log("Error");
            res.render("error");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, found) {
        if (err) {
            //console.log("Error");
            res.render("error");
        } else {
            res.render("show", { blog: found });
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, edit) {
        if (err) {
            //console.log("Error");
            res.render("error");
        } else {
            res.render("edit", { blog: edit });
        }
    });
});

app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, update) {
        if (err) {
            //console.log("Error");
            res.render("error");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            res.render("error");
        } else {
            res.redirect("/");
        }
    })
});

app.listen("3000", function() {
    console.log("Server is running");
});