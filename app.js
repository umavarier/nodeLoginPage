const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//port
const app = express();
const PORT = 4000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', (req, res) => {
    res.render('index')
})

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));


// cookie parser middleware
app.use(cookieParser());

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "itsasecret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(function(req, res, next){
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
})


//username and password
const myusername = 'parvathi.kumar@gmail.com'
const mypassword = 'Unni@1234'

// a variable to save a session
var session;

// app.get('/',(req,res) => {
//     session=req.session;
//     if(session.userid){
//         res.send("Welcome User <a href=\'/logout'>click to logout</a>");
//         // res.render('index');
//     }else
//     res.sendFile('views/index',{root:__dirname})
// });

const user = {
    firstName: 'parvathi',
    lastName: 'kumar',
    admin: false,
}

const posts = [
    {title: 'Title 1', body: 'Body 1' }, 
    {title: 'Title 2', body: 'Body 2' },
    {title: 'Title 3', body: 'Body 3' },
    {title: 'Title 4', body: 'Body 4' },
]

app.post('/user',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.render("home",{user, title: "Home Page",articles: posts,})
        

    }
    else{
        res.send('Invalid username or password!');
        //  res.render('views/index', { error: 'Incorrect username or password!!!' });
        // return;
        // res.end("Invalid username or pasword!!")
    }
})


app.get('/logout',(req,res) => {
    
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
