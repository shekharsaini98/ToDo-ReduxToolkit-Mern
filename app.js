const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Todo = require('./models/todo');
const PORT = 5000;
const {JWT_SECRET, MONGOURI} = require('./config/keys');
mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

mongoose.connection.on('connected',()=>{
    console.log('Connected to mongoose');
});

mongoose.connection.on('error',(e)=>{
    console.log('Connection error', e);
});
app.use(express.json());
// token check and request middleware
const requireLogin = (req, res, next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"});
    }
    try {
        const {userId} = jwt.verify(authorization,JWT_SECRET);
        req.user = userId;
        next();
    } catch (error) {
        return res.status(401).json({error:"You must be logged in 2"});
    }
}
// SignUp
app.post('/signup', async (req,res)=>{
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(422).json({error: "All fields required"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(422).json({error: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await new User({
            email,
            password:hashedPassword
        }).save()
        res.status(200).json({message: "Signup success, You can login now"});

    }catch(err){
        console.log(err);
    }
});
// SignIn
app.post('/signin', async (req,res)=>{
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(422).json({error: "All fields required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if(doMatch){
            const token = await jwt.sign({userId:user._id},JWT_SECRET);
            res.status(201).json({token})
        }
        else{
            return res.status(401).json({error: "Email or Password are incorrect"});
        }
    }catch(err){
        console.log(err);
    }
})
// Create Todo
app.post('/createtodo', requireLogin, async (req, res)=>{
    const {todo} = req.body;
    try {
        if(!todo){
            return res.status(422).json({error: "Todo field is required"});
        }
        const todoDate = await new Todo({
            todo,
            todoBy: req.user
        }).save();
        res.status(201).json({message:todoDate});
    } catch (error) {
        
    }
})
// Get Todos
app.get('/gettodos', requireLogin, async (req, res)=>{
    const todos = await Todo.find({
        todoBy: req.user
    });
    res.status(200).json({message:todos})
});
// Delete Todo
app.delete('/remove/:id', requireLogin, async (req, res)=>{
    const todoId = req.params.id;
    const deleteTodo = await Todo.findOneAndRemove({
        _id:todoId
    })
    res.status(200).json({message:deleteTodo})
});
// Serve app
if(process.env.NODE_ENV=='production'){
    const path = require('path')
    app.get('/',(req, res)=>{
        app.use(express.static(path.resolve(__dirname, 'client', 'build')));
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
// Server Start
app.listen(PORT, ()=>{
    console.log(`Server start on PORT:${PORT}`);
})