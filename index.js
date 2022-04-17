const express = require('express');
const app = express();
const path = require('path');
const User = require('./src/models/user');
require('./config/database');
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.status(200).render('pages/index');
})



app.get('/all', async (req, res) => {           // get all users
    try{
        const users = await User.find({});
        res.status(200).send(users)
    } catch(error){
        res.status(500).send(error)
    }
})



app.get('/abrir', (req, res) => {            
    res.status(200).render('pages/abrir');
})



app.post('/abrir', async (req, res) => {            // open a user account
    let { name, age, password, balance } = req.body;

    let user = new User({name, age, password, balance});

    try{
        await user.save();
        res.redirect(`/main/${user._id}`);
    } catch(error){
        res.status(500).send(error);
    }
})


app.get('/entrar', (req, res) => {
    res.status(200).render('pages/entrar');
})

app.post('/entrar', async (req, res) => {
    let { name, password } = req.body;
    const user = await User.findOne({name, password});
    if(!user){
        res.write("<h1>Usuario ou senha incorretos</h1>");
        setInterval(() => {
            res.redirect('/entrar');
        }, 2000)
    }else{
        res.redirect(`/main/${user._id}`);
    }  
})


app.get('/main/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    res.render('pages/mainPage', {user:user});
})


app.get('/sacar/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).render('pages/sacar', {user:user});
})

app.post('/sacar/:id', async (req, res) => {
    let { amount } = req.body;
    const userI = await User.findById(req.params.id);
    
    if(amount <= 0 || amount > userI.balance){
        res.redirect(`/sacar/${req.params.id}`);
    }else{
        const user = await User.findOneAndUpdate({_id:req.params.id}, {$inc:{balance:-amount}}, {new: true});
        await user.save() 
        res.status(200).redirect(`/main/${user._id}`);
    }
})


app.get('/depositar/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).render('pages/depositar', {user:user});
})

app.post('/depositar/:id', async (req, res) => {
    let { amount } = req.body;
    const user = await User.findOneAndUpdate({_id:req.params.id}, {$inc:{balance:+amount}}, {new: true});
    try{
        await user.save();
        res.status(200).redirect(`/main/${user._id}`);
    } catch(error){
        res.status(500).send(error)
    }
})


app.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.redirect('/')
    } catch(error){
        res.status(500).send(error);
    }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})